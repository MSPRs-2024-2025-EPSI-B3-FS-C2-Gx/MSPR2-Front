import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth/auth.service';

export const AuthGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn) {
    router.navigate(['/login']).then(() => console.log('Navigated to auth'));
    return false;
  }
  return true;
}
