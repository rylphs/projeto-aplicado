import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Paths } from '../../app.routes';

export const hasRoleGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  /*if(!authService.isLoggedIn()){
    authService.setRedirect(state.url);
    return router.navigate([Paths.LOGIN]);
  }

  const userRole: UserRole[] = authService.getUserRole();
  const expectedRoles: Roles[] = route.data['roles'];

  const hasRole: boolean = expectedRoles.some((role) => userRole.includes(role));

  return hasRole || router.navigate([Paths.NAO_AUTORIZADO]);*/
  return true;
};