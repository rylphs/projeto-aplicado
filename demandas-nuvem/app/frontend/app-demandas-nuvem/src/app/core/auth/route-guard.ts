import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Paths } from '../../app.routes';

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  if(!authService.isLogged()){
    router.navigate([Paths.LOGIN]);
  }
  return true;
};