import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../../store/user/user.selectors';
import { RouterLink, RouterModule } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { logoutUser, rehydrateUser } from '../../../store/user/user.actions';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  imagepath = 'assets/logo.png';
  currentUser$: Observable<User | null>;
  showMenu = false;

  constructor(private store: Store,private storageService: StorageService) {
    this.currentUser$ = this.store.select(selectCurrentUser);
  }
  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  ngOnInit() {
    const user = this.storageService.getStoredUser();
    if (user) {
      this.store.dispatch(rehydrateUser({ user }));
    }
  }

  logout(): void {
    this.store.dispatch(logoutUser()); 
    this.showMenu = false;
  }
}
