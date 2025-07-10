import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {Role} from '../../models/role.model';
import {RoleService} from '../role/role.service';
import {AuthResponse} from '../../models/auth.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private apiUrl = 'https://api-mspr-2-kldok.gaetandev.fr';

  constructor(
    private http: HttpClient,
    private roleService: RoleService
  ) {
    this.isLoggedInSubject.next(localStorage.getItem('token') !== null);
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  login(email: string, password: string): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      this.http.post<AuthResponse | { error: string }>(
        `${this.apiUrl}/api/login`,
        {email, password}
      ).subscribe({
        next: (response) => {
          if ('error' in response) {
            reject(new Error(response.error));
            return;
          }

          const authResponse = response as AuthResponse;
          localStorage.setItem('token', authResponse.token);
          localStorage.setItem('email', authResponse.user.email);

          // Convertir le rôle numérique en valeur d'énumération
          const roleValue = Object.values(Role)[authResponse.user.role - 1];
          this.roleService.setRole(roleValue);

          this.isLoggedInSubject.next(true);
          resolve(authResponse);
        },
        error: (error) => {
          const errorMessage = error.error?.error || 'Une erreur est survenue lors de la connexion';
          reject(new Error(errorMessage));
        }
      });
    });
  }

  register(email: string, password: string, roleId: number = 1): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      // Envoyer la requête avec le format attendu
      this.http.post<{ message: string } | { error: string }>(
        `${this.apiUrl}/api/register`,
        {email, password, role: roleId}
      ).subscribe({
        next: (response) => {
          // Vérifier si c'est une réponse d'erreur
          if ('error' in response) {
            reject(new Error(response.error));
            return;
          }

          // Vérifier si c'est une réponse de succès
          if ('message' in response) {
            // Définir le rôle après une inscription réussie
            const roleValue = Object.values(Role)[roleId - 1];
            this.roleService.setRole(roleValue);
            this.isLoggedInSubject.next(true);
            resolve({message: response.message});
            return;
          }

          // Réponse inattendue
          reject(new Error('Réponse du serveur inattendue'));
        },
        error: (error) => {
          // Gestion des erreurs HTTP
          if (error.status === 0) {
            reject(new Error('Impossible de se connecter au serveur'));
          } else if (error.error && error.error.error) {
            reject(new Error(error.error.error));
          } else {
            reject(new Error('Une erreur est survenue lors de l\'inscription'));
          }
        }
      });
    });
  }

  getRole(): Role | null {
    return this.roleService.getRole();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.roleService.clearRole();
    this.isLoggedInSubject.next(false);
  }
}
