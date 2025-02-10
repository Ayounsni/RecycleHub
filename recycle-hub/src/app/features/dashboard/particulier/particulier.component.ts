import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { filter, Observable, take } from 'rxjs';
import { selectUserCollectRequests } from '../../../store/collectRequest/collectRequest.selectors';
import { addCollectRequest, deleteCollectRequest, loadCollectRequests, loadUserCollectRequests, updateCollectRequest } from '../../../store/collectRequest/collectRequest.actions';
import { selectCurrentUser } from '../../../store/user/user.selectors';
import { CollectRequest } from '../../../shared/models/collectRequest';
import { User } from '../../../shared/models/user';
import { CollectFormModalComponent } from '../../forms/collect-form-modal/collect-form-modal.component';


@Component({
  selector: 'app-particulier',
  imports: [ReactiveFormsModule, CommonModule,CollectFormModalComponent],
  templateUrl: './particulier.component.html',
  styleUrl: './particulier.component.css'
})
export class ParticulierComponent implements OnInit {
collections$: Observable<CollectRequest[]>;
showModal: boolean = false;
isEditMode: boolean = false;
selectedCollect: CollectRequest | null = null;
currentUser$: Observable<User | null>;


constructor(private store: Store) {
  this.collections$ = this.store.select(selectUserCollectRequests);
  this.currentUser$ = this.store.select(selectCurrentUser);
}

ngOnInit(): void {
  this.currentUser$.pipe(
    filter(user => !!user),
    take(1)
  ).subscribe(user => {
    if (user?.role === 'user') {
      this.store.dispatch(loadUserCollectRequests({ userId: user.id }));
    }
  });
}

openAddModal(): void {
  this.isEditMode = false;
  this.selectedCollect = null;
  this.showModal = true;
}

openEditModal(collect: CollectRequest): void {
  this.isEditMode = true;
  this.selectedCollect = collect;
  this.showModal = true;
}

closeModal(): void {
  this.showModal = false;
}

handleFormSubmit(collect: CollectRequest): void {
  if (this.isEditMode && this.selectedCollect) {
    this.store.dispatch(updateCollectRequest({ request: { ...this.selectedCollect, ...collect } }));
  } else {
    this.store.dispatch(addCollectRequest({ request: collect }));
  }
}


deleteRequest(id: string): void {
  this.store.dispatch(deleteCollectRequest({ id }));
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
}
