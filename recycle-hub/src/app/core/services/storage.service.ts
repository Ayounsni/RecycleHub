import { Injectable } from '@angular/core';

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

  LocalStorage<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T[] : [];
  }

  removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  isExistInLocalStorage(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
  
}
