import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const managerAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  const role = authService.getCurrentState();

  if (user && role === 'manager') {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};