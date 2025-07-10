import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../services/auth/auth.service';
import {RoleService} from '../services/role/role.service';
import {Role} from '../models/role.model';

/**
 * Vérifie si l'utilisateur a le rôle requis pour accéder à une route
 * @param roles Rôles autorisés à accéder à la route
 */
export const roleGuard: (roles?: Role[]) => CanActivateFn = (roles: Role[] = []) => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const roleService = inject(RoleService);
    const router = inject(Router);

    // Vérifier si l'utilisateur est connecté
    if (!authService.isLoggedIn) {
      router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;
    }

    console.log(roleService.getRole());

    // Si aucun rôle n'est spécifié, l'accès est autorisé
    if (!roles || roles.length === 0) {
      return true;
    }

    // Vérifier si l'utilisateur a l'un des rôles requis
    const hasRequiredRole = roleService.hasAnyRole(roles);

    if (!hasRequiredRole) {
      // Rediriger vers la page non autorisée ou la page par défaut
      router.navigate(['/client/unauthorized']);
      return false;
    }

    return true;
  };
};
