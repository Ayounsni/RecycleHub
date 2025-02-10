import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfirmationPopupComponent } from '../../shared/components/confirmation-popup/confirmation-popup.component';
import { User } from '../../shared/models/user';
import { selectCurrentUser } from '../../store/user/user.selectors';
import { deleteUser, updateUser } from '../../store/user/user.actions';


@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule,ConfirmationPopupComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
 editMode = false;
  profileForm: FormGroup;
  currentUser$: Observable<User | null>;
  showConfirmationPopup = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required]
    });
    this.currentUser$ = this.store.select(selectCurrentUser);
  }

  ngOnInit(): void {
    this.currentUser$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      this.profileForm.patchValue(user);
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.currentUser$.pipe(take(1)).subscribe(currentUser => {
        if (!currentUser) {
          return;
        }

        const updatedUser: User = {
          ...currentUser,
          ...this.profileForm.value
        };

        this.store.dispatch(updateUser({ user: updatedUser }));

        this.editMode = false;
      });
    }
  }

  cancelEdit(): void {
    this.currentUser$.pipe(take(1)).subscribe(currentUser => {
      if (currentUser) {
        this.profileForm.patchValue(currentUser);
      }
      this.editMode = false;
    });
  }

  deleteAccount(): void {
    this.showConfirmationPopup = true; 
  }

  handleConfirmation(confirmed: boolean): void {
    this.showConfirmationPopup = false; 

    if (confirmed) {
      this.currentUser$.pipe(take(1)).subscribe(currentUser => {
        if (!currentUser) {
          return;
        }

        this.store.dispatch(deleteUser({ id: currentUser.id }));

        this.router.navigate(['/login']);
      });
    }
  }
}
