import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';
import { User } from '../../../shared/models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  userForm!: FormGroup;
  users: User[] = []; // Liste des utilisateurs
  private storageKey = 'users'; // Clé pour LocalStorage

  constructor(private fb: FormBuilder, private storageService: StorageService) {}

  ngOnInit(): void {
    this.initForm(); // Initialiser le formulaire
    this.loadUsers(); // Charger les utilisateurs
  }

  // Initialiser le formulaire
  initForm(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      birthDate: ['', Validators.required],
      role: ['user', Validators.required], // ✅ Rôle par défaut
      city: ['', Validators.required],
      points: [0, [Validators.required, Validators.min(0)]] // ✅ Validation des points
    });
  }

  // Charger les utilisateurs depuis LocalStorage
  loadUsers(): void {
    this.users = this.storageService.getArrayFromLocalStorage<User>(this.storageKey) || [];
  }

  // Ajouter un utilisateur
  addUser(): void {
    if (this.userForm.valid) {
      const newUser: User = {
        id: Date.now().toString(), // ✅ ID unique
        ...this.userForm.value,
        birthDate: new Date(this.userForm.value.birthDate) // ✅ Conversion en Date
      };

      this.users.push(newUser); // Ajouter à la liste locale
      this.storageService.saveToLocalStorage(this.storageKey, this.users); // Sauvegarder dans LocalStorage
      this.userForm.reset({ role: 'user', points: 0 }); // Réinitialiser le formulaire avec des valeurs par défaut
    }
  }

  // Supprimer un utilisateur
  deleteUser(id: string): void {
    this.users = this.users.filter(user => user.id !== id);
    this.storageService.saveToLocalStorage(this.storageKey, this.users); // Mettre à jour LocalStorage
  }
}
