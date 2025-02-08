import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginnComponent } from './features/auth/loginn/loginn.component';
import { HomeComponent } from './features/home/home.component';
import { TestComponent } from './shared/components/test/test.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'users', component: LoginComponent},
    {path: 'test', component: TestComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginnComponent}
];
