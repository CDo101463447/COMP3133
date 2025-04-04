import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service'; // Import AuthService

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);  // Inject AuthService

  const isLoggedIn = authService.isAuthenticated();  // Check if authenticated using AuthService

  if (!isLoggedIn) {
    // Redirect to login if not logged in
    router.navigate(['/login']);
    return false;
  }

  return true;  // Allow navigation if logged in
};
