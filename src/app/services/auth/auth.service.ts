import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;

  constructor() {
    this.isLoggedIn = localStorage.getItem('token') !== null;
  }

  login(email: string): Promise<void> {
    this.isLoggedIn = true;
    localStorage.setItem('token', '123');
    localStorage.setItem('email', email);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }
}
