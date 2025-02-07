import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginnComponent } from './features/auth/loginn/loginn.component';

export const routes: Routes = [
    {path: 'users', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginnComponent}
];
