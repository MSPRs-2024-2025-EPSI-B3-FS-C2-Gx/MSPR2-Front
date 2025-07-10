import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth/auth.service';

export const RoleGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.getRole() === 'DE') {
    router.navigate(['/client/predictions']).then(() => console.log('Navigated to auth'));
    return false;
  }

  return true;
}
