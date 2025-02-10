import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { filter, Observable, take } from 'rxjs';
import { selectCollectorCollectRequests, selectUserCollectRequests } from '../../../store/collectRequest/collectRequest.selectors';
import { addCollectRequest, deleteCollectRequest, loadCollectorCollectRequests, loadCollectRequests, loadUserCollectRequests, updateCollectRequest } from '../../../store/collectRequest/collectRequest.actions';
import { selectCurrentUser } from '../../../store/user/user.selectors';
import { CollectRequest } from '../../../shared/models/collectRequest';
import { User } from '../../../shared/models/user';
import { CollectFormModalComponent } from '../../forms/collect-form-modal/collect-form-modal.component';
import { StatusFormModalComponent } from "../../forms/status-form-modal/status-form-modal.component";

@Component({
  selector: 'app-collecteur',
  imports: [ReactiveFormsModule, CommonModule, StatusFormModalComponent],
  templateUrl: './collecteur.component.html',
  styleUrl: './collecteur.component.css'
})
export class CollecteurComponent implements OnInit {
  collections$: Observable<CollectRequest[]>;
  showModal: boolean = false;
  isEditMode: boolean = false;
  selectedCollect: CollectRequest | null = null;
  currentUser$: Observable<User | null>;
  
  
  constructor(private store: Store) {
    this.collections$ = this.store.select(selectCollectorCollectRequests);
    this.currentUser$ = this.store.select(selectCurrentUser);
  }
  
  ngOnInit(): void {
    this.currentUser$.pipe(
      filter(user => !!user),
      take(1)
    ).subscribe(user => {
      if (user?.role === 'collector') {
        this.store.dispatch(loadCollectorCollectRequests({ city: user.city }));
      }
    });
  }

  openEditModal(collect: CollectRequest): void {
    this.isEditMode = true;
    this.selectedCollect = collect;
    this.showModal = true;
  }
  
  closeModal(): void {
    this.showModal = false;
  }


  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'plastic': '♻️',
      'glass': '🍷',
      'paper': '📄',
      'metal': '🔩'
    };
    return icons[type] || '🗑';
  }

  handleFormSubmit(collect: CollectRequest): void {
    if (this.isEditMode && this.selectedCollect) {
      this.store.dispatch(updateCollectRequest({ request: { ...this.selectedCollect, ...collect } }));
    } 
  }

}
