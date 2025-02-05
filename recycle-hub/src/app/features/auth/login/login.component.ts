// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { StorageService } from '../../../core/services/storage.service';
// import { User } from '../../../shared/models/user';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-login',
//   standalone:true,
//   imports: [ReactiveFormsModule,CommonModule],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css'
// })
// export class LoginComponent implements OnInit {

//   userForm!: FormGroup;
//   users: User[] = []; // Liste des utilisateurs
//   private storageKey = 'users'; // Clé pour LocalStorage
  // currentUserId: string | null = null;

//   constructor(private fb: FormBuilder, private storageService: StorageService) {}

//   ngOnInit(): void {
//     this.initForm(); // Initialiser le formulaire
//     this.loadUsers(); // Charger les utilisateurs
//   }

//   // login.component.ts
//   getUserById(id: string): User | undefined {
//     return this.users.find(user => user.id === id);
//   }

//   // login.component.ts
// editUserById(id: string): void {
//   const user = this.getUserById(id);
//   if (user) {
//     this.userForm.patchValue({
//       email: user.email,
//       password: user.password,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       address: user.address,
//       phone: user.phone,
//       birthDate: new Date(user.birthDate).toISOString().split('T')[0],
//       role: user.role,
//       city: user.city,
//       points: user.points
//     });
//     this.currentUserId = user.id; // Stocker l'ID de l'utilisateur en cours de modification
//   }
// }

//   // Initialiser le formulaire
//   initForm(): void {
//     this.userForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       address: ['', Validators.required],
//       phone: ['', Validators.required],
//       birthDate: ['', Validators.required],
//       role: ['user', Validators.required], // ✅ Rôle par défaut
//       city: ['', Validators.required],
//       points: [0, [Validators.required, Validators.min(0)]] // ✅ Validation des points
//     });
//   }

//   // Charger les utilisateurs depuis LocalStorage
//   loadUsers(): void {
//     this.users = this.storageService.getArrayFromLocalStorage<User>(this.storageKey) || [];
//   }

//   updateUser(updatedUser: User): void {
//     const index = this.users.findIndex(user => user.id === updatedUser.id);
//     if (index !== -1) {
//       this.users[index] = updatedUser;
//       this.storageService.saveToLocalStorage(this.storageKey, this.users);
//     }
//   }

//   // Ajouter un utilisateur
// // login.component.ts
//     addUser(): void {
//       if (this.userForm.valid) {
//         const userData: User = {
//           id: this.currentUserId || Date.now().toString(), // Utiliser l'ID existant ou en générer un nouveau
//           ...this.userForm.value,
//           birthDate: new Date(this.userForm.value.birthDate)
//         };

//         if (this.currentUserId) {
//           // Mettre à jour l'utilisateur existant
//           this.updateUser(userData);
//         } else {
//           // Ajouter un nouvel utilisateur
//           this.users.push(userData);
//           this.storageService.saveToLocalStorage(this.storageKey, this.users);
//         }

//         // Réinitialiser le formulaire et l'ID en cours de modification
//         this.userForm.reset({ role: 'user', points: 0 });
//         this.currentUserId = null;
//       }
//     }

//   // Supprimer un utilisateur
//   deleteUser(id: string): void {
//     this.users = this.users.filter(user => user.id !== id);
//     this.storageService.saveToLocalStorage(this.storageKey, this.users); // Mettre à jour LocalStorage
//   }
// }
// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import { User } from '../../../shared/models/user';
import { addUser, deleteUser, loadUsers, updateUser } from '../../../store/user/user.actions';
import { selectCurrentUser, selectUsers } from '../../../store/user/user.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userForm!: FormGroup;
  users$: Observable<User[]>; // Liste des utilisateurs
  currentUser$: Observable<User | undefined>; // Utilisateur sélectionné (corrigé)
  selectedUserId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.users$ = this.store.select(selectUsers);
    this.currentUser$ = this.store.select(selectCurrentUser);
  }

  ngOnInit(): void {
    this.initForm();
    this.store.dispatch(loadUsers()); // Charger les utilisateurs depuis le Store

    this.currentUser$.subscribe(user => {
      if (user) this.setFormValues(user);
    });
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      birthDate: ['', Validators.required],
      role: ['user', Validators.required], 
      city: ['', Validators.required],
      points: [0, [Validators.required, Validators.min(0)]]
    });
  }

  private setFormValues(user: User): void {
    this.userForm.patchValue({
      ...user,
      birthDate: new Date(user.birthDate).toISOString().split('T')[0]
    });
  }

  submitUser(): void {
    if (this.userForm.valid) {
      const userData: User = { ...this.userForm.value, birthDate: new Date(this.userForm.value.birthDate) };
  
      if (this.selectedUserId) {
        this.store.dispatch(updateUser({ user: { ...userData, id: this.selectedUserId } }));
        this.selectedUserId = null;
      } else {
        const userId = Date.now().toString();
        this.store.dispatch(addUser({ user: { ...userData, id: userId } }));
      }
  
      this.userForm.reset({ role: 'user', points: 0 });
    }
  }

  editUser(user: User): void {
    this.selectedUserId = user.id;
    this.setFormValues(user);
  }

  deleteUser(id: string): void {
    this.store.dispatch(deleteUser({ id }));
  }
}