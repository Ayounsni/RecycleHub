import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { StorageService } from '../../../core/services/storage.service';
import { selectCurrentUser } from '../../../store/user/user.selectors';
import { deleteUser, updateUser } from '../../../store/user/user.actions';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {

  collections = [
    {
      id: 1,
      type: 'Plastique',
      weight: 2500,
      address: '12 Rue Verte, Paris',
      date: '2023-12-15',
      time: '14:00',
      status: 'en attente'
    },
    {
      id: 2,
      type: 'Verre',
      weight: 4500,
      address: '12 Rue Verte, Paris',
      date: '2023-12-18',
      time: '11:30',
      status: 'collecté'
    }
  ];
  
  getTypeIcon(type: string) {
    const icons: {[key: string]: string} = {
      'Plastique': '♻️',
      'Verre': '🍷',
      'Papier': '📄',
      'Métal': '🔩'
    };
    return icons[type] || '🗑';
  }
 
}