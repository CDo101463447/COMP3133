import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';  // Ensure components are generated
import { SignupComponent } from './signup/signup.component';  // Ensure components are generated
import { EmployeeComponent } from './employee/employee.component';  // Ensure components are generated

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Default route
];
