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

        // Mise à jour NgRx
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
    this.showConfirmationPopup = true; // Affiche la pop-up
  }

  handleConfirmation(confirmed: boolean): void {
    this.showConfirmationPopup = false; // Masque la pop-up

    if (confirmed) {
      this.currentUser$.pipe(take(1)).subscribe(currentUser => {
        if (!currentUser) {
          return;
        }

        // Dispatch de l'action de suppression
        this.store.dispatch(deleteUser({ id: currentUser.id }));

        // Redirection vers la page d'accueil ou de connexion
        this.router.navigate(['/login']);
      });
    }
  }
}
