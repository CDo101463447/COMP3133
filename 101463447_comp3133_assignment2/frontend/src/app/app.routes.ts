import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { EmployeeComponent } from './employee/employee.component';
import { authGuard } from './auth.guard';  // Import the authGuard

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employee', component: EmployeeComponent, canActivate: [authGuard] },  // Protect the employee route with the guard
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Default route
];
