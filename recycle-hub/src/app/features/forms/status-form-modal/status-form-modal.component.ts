import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CollectRequest } from '../../../shared/models/collectRequest';
import { CommonModule } from '@angular/common';
import { User } from '../../../shared/models/user';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-status-form-modal',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './status-form-modal.component.html',
  styleUrl: './status-form-modal.component.css'
})
export class StatusFormModalComponent implements OnInit {
    @Input() isEditMode: boolean = false;
    @Input() collectToEdit: CollectRequest | null = null;
    @Input() currentUser: User | null = null;
    @Output() formSubmit = new EventEmitter<CollectRequest>();
    @Output() closeModal = new EventEmitter<void>();
  
    collectForm!: FormGroup;
  
    constructor(private fb: FormBuilder,private store: Store) {}
  
  
  
    ngOnInit(): void {
      console.log('Current User:', this.currentUser);
      this.collectForm = this.fb.group({
        status: ['pending',Validators.required],
      });
  
      if (this.isEditMode && this.collectToEdit) {
        this.collectForm.patchValue({
          ...this.collectToEdit, 
        });
      }
    }
  
    onSubmit(): void {
      if (this.collectForm.valid) {
        const formValue = {
          ...this.collectForm.value,
        };
        this.formSubmit.emit(formValue);
        this.onClose();
      } 
    }
  
    onClose(): void {
      this.closeModal.emit();
    }
  
  }

