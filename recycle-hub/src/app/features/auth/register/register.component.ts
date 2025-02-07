import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { addUser } from '../../../store/user/user.actions';
import { User } from '../../../shared/models/user';
import { uniqueEmailValidator } from '../../../shared/validators/unique-email.validator';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }


  private initForm(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, uniqueEmailValidator(this.storageService)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      birthDate: ['', Validators.required],
      role: ['user', Validators.required], 
      city: ['', Validators.required],
      points: [0, [Validators.required, Validators.min(0)]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  submitRegister(): void {
    if (this.registerForm.valid) {
      const userData: User = {
        ...this.registerForm.value,
        birthDate: new Date(this.registerForm.value.birthDate), 
      };
      const userId = Date.now().toString();
      this.store.dispatch(addUser({ user: { ...userData, id: userId } }));
    }
  }
}
