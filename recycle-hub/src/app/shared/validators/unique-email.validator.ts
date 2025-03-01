import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { User } from '../models/user';
import { StorageService } from '../../core/services/storage.service';

export function uniqueEmailValidator(storageService: StorageService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    if (!email) return null; 
    const users: User[] = storageService.getArrayFromLocalStorage<User>('users') || [];
    const emailExists = users.some(u => u.email === email);
    return emailExists ? { emailExists: true } : null;
  };
}
