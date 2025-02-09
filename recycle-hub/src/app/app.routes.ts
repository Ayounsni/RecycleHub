import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { TestComponent } from './shared/components/test/test.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'test', component: TestComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'profile', component: ProfileComponent}
];
