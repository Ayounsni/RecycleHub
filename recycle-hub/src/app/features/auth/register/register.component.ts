// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Store } from '@ngrx/store';
// import { CommonModule } from '@angular/common';
// import { addUser } from '../../../store/user/user.actions';
// import { User } from '../../../shared/models/user';
// import { uniqueEmailValidator } from '../../../shared/validators/unique-email.validator';
// import { StorageService } from '../../../core/services/storage.service';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css']
// })
// export class RegisterComponent implements OnInit {
//   registerForm!: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private store: Store,
//     private storageService: StorageService
//   ) {}

//   ngOnInit(): void {
//     this.initForm();
//   }


//   private initForm(): void {
//     this.registerForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email, uniqueEmailValidator(this.storageService)]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       confirmPassword: ['', Validators.required],
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       address: ['', Validators.required],
//       phone: ['', Validators.required],
//       birthDate: ['', Validators.required],
//       role: ['user', Validators.required], 
//       city: ['', Validators.required],
//       points: [0, [Validators.required, Validators.min(0)]]
//     }, { validators: this.passwordMatchValidator });
//   }

//   passwordMatchValidator(form: FormGroup) {
//     return form.get('password')?.value === form.get('confirmPassword')?.value
//       ? null
//       : { mismatch: true };
//   }

//   submitRegister(): void {
//     if (this.registerForm.valid) {
//       const userData: User = {
//         ...this.registerForm.value,
//         birthDate: new Date(this.registerForm.value.birthDate), 
//       };
//       const userId = Date.now().toString();
//       this.store.dispatch(addUser({ user: { ...userData, id: userId } }));
//     }
//   }
// }

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../shared/models/user';
import { Store } from '@ngrx/store';
import { StorageService } from '../../../core/services/storage.service';
import { uniqueEmailValidator } from '../../../shared/validators/unique-email.validator';
import { addUser } from '../../../store/user/user.actions';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;
  currentStep = 1;
  totalSteps = 3;

  constructor(private fb: FormBuilder ,private store: Store, private storageService: StorageService) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      step1: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email,uniqueEmailValidator(this.storageService)]],
      }),
      step2: this.fb.group({
        address: ['', Validators.required],
        phone: ['', Validators.required],
        birthDate: ['', Validators.required],
        city: ['', Validators.required],
        role: ['user'], 
        points: [0],
      }),
      step3: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      }, { validators: this.passwordMatchValidator })
    });
  }


  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  // Méthodes existantes...
  getStepLabel(step: number): string {
    return ['Informations', 'Coordonnées', 'Sécurité'][step - 1];
  }
  
  getStepSubtitle(step: number): string {
    return ['Basique', 'Contact', 'Confidentialité'][step - 1];
  }

  get step1Form() {
    return this.registrationForm.get('step1') as FormGroup;
  }

  get step2Form() {
    return this.registrationForm.get('step2') as FormGroup;
  }

  get step3Form() {
    return this.registrationForm.get('step3') as FormGroup;
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const { step1, step2, step3 } = this.registrationForm.value;
      
      const userData: User = {
        ...step1,
        ...step2,
        ...step3,
        birthDate: new Date(step2.birthDate),
      };
  
      const userId = Date.now().toString();
      
      this.store.dispatch(addUser({ 
        user: { 
          ...userData, 
          id: userId 
        } 
      }));
    }
  }
}

