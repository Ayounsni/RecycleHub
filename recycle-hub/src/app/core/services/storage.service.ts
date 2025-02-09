import { Injectable } from '@angular/core';
import { User } from '../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  saveToLocalStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }


  getFromLocalStorage<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T : null;
  }

  getArrayFromLocalStorage<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T[] : [];
  }


  removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  isExistInLocalStorage(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  getStoredUser(): User | null {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  updateUserInLocalStorage(updatedUser: User): void {
    // Mise à jour de la liste des utilisateurs
    const users = this.getArrayFromLocalStorage<User>('users') || [];
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    this.saveToLocalStorage('users', updatedUsers);

    // Mise à jour de l'utilisateur courant
    this.saveToLocalStorage('currentUser', updatedUser);
  }

  removeUserFromLocalStorage(userId: string): void {
    const users = this.getArrayFromLocalStorage<User>('users') || [];
    const updatedUsers = users.filter(u => u.id !== userId);
    this.saveToLocalStorage('users', updatedUsers);
  
    // Supprimez également l'utilisateur courant s'il correspond
    const currentUser = this.getFromLocalStorage<User>('currentUser');
    if (currentUser && currentUser.id === userId) {
      this.removeFromLocalStorage('currentUser');
    }
  }
  
}
