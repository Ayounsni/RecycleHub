import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CollectRequest } from '../../../shared/models/collectRequest';
import { CommonModule } from '@angular/common';
import { User } from '../../../shared/models/user';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { selectAddRequestError } from '../../../store/collectRequest/collectRequest.selectors';
import { resetAddRequestError } from '../../../store/collectRequest/collectRequest.actions';

function futureDateValidator(control: any) {
  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate > today ? null : { pastDate: true };
}

function timeSlotValidator(control: any) {
  const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!control.value.match(timePattern)) {
    return { invalidFormat: true };
  }
  
  const [hours, minutes] = control.value.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes >= 540 && totalMinutes <= 1080 ? null : { invalidTime: true };
}

@Component({
  selector: 'app-collect-form-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './collect-form-modal.component.html',
  styleUrls: ['./collect-form-modal.component.css']
})
export class CollectFormModalComponent implements OnInit {
  @Input() isEditMode: boolean = false;
  @Input() collectToEdit: CollectRequest | null = null;
  @Input() currentUser: User | null = null;
  @Output() formSubmit = new EventEmitter<CollectRequest>();
  @Output() closeModal = new EventEmitter<void>();
  errorMessage: string | null = null;

  collectForm!: FormGroup;

  constructor(private fb: FormBuilder,private store: Store) {}



  ngOnInit(): void {
    console.log('Current User:', this.currentUser);
    this.collectForm = this.fb.group({
      userId: [this.currentUser?.id],
      wasteTypes: ['plastic', Validators.required],
      estimatedWeight: [null, [Validators.required, Validators.min(1000),Validators.pattern(/^\d+$/)]],
      address: ['', Validators.required],
      date: ['', [Validators.required,futureDateValidator]],
      timeSlot: ['', [Validators.required,timeSlotValidator]],
      status: ['pending'],
      city: [this.currentUser?.city]
    });

    if (this.isEditMode && this.collectToEdit) {
      this.collectForm.patchValue({
        ...this.collectToEdit,
        date: this.formatDate(this.collectToEdit.date) 
      });
    }
  }

formatDate(date: string | Date): string {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return date ? new Date(date).toISOString().split('T')[0] : '';
}

  onSubmit(): void {
    this.errorMessage = null;
    if (this.collectForm.valid) {
      const formValue = {
        ...this.collectForm.value,
        date: new Date(this.collectForm.value.date) 
      };
      this.formSubmit.emit(formValue);

      this.store.select(selectAddRequestError).pipe(
        take(1) 
      ).subscribe(errorType => {
        if (errorType === 'maxRequests') {
          this.errorMessage = "Vous avez déjà 3 demandes en attente ou rejetées";
        }
        else if (errorType === 'maxWeight') {
          this.errorMessage = "Le poids total des collectes dépasse 10kg (10 000g)";
        }

        if (!errorType) {
          this.onClose(); 
        }
  
        this.store.dispatch(resetAddRequestError());
      });
    } else {
      this.collectForm.markAllAsTouched();
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

}
