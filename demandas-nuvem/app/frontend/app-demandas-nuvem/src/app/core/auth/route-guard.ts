import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Paths } from '../../app.routes';
import { UserRole } from '../../features/usuarios/usuario.model';


const AUTH_MAP = {
  "usuarios": {
      "GET": ["ADMIN", "GESTOR", "TECNICO"],
      "PUT": ["ADMIN"],
      "DELETE": ["ADMIN"],
      "POST": ["ADMIN"]
  },
  "demandas": {
      "GET": ["ADMIN", "GESTOR", "TECNICO"],
      "PUT": ["GESTOR"],
      "DELETE": ["GESTOR"],
      "POST": ["GESTOR"]
  }
}

export const hasRoleGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  if(!authService.isLogged()){
    router.navigate([Paths.LOGIN]);
  }


  const userRole = authService.currentUser?.role;
  const expectedRoles: String[] = route.data['roles'];

  const hasRole: boolean = userRole ?  expectedRoles.includes(userRole) : false;

  return hasRole || router.navigate([Paths.NAO_AUTORIZADO]);
  return true;
};