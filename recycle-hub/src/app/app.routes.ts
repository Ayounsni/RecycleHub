import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ProfileComponent } from './features/profile/profile.component';
import { ParticulierComponent } from './features/dashboard/particulier/particulier.component';
import { CollecteurComponent } from './features/dashboard/collecteur/collecteur.component';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { userGuard } from './core/guards/user.guard';
import { collecteurGuard } from './core/guards/collecteur.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [noAuthGuard] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [noAuthGuard],
  },
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  {
    path: 'dashboard-particulier',
    component: ParticulierComponent,
    canActivate: [authGuard, userGuard],
  },
  {
    path: 'dashboard-collecteur',
    component: CollecteurComponent,
    canActivate: [authGuard, collecteurGuard],
  },
];
