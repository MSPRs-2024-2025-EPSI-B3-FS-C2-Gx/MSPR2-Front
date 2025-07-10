import {Injectable} from '@angular/core';
import {Role, UserRole} from '../../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly STORAGE_KEY = 'role';

  getRole(): Role | null {
    const role = localStorage.getItem(this.STORAGE_KEY);
    if (!role) return null;

    // Convertir la chaîne en valeur d'enum
    return Role[role as keyof typeof Role] || null;
  }

  setRole(role: Role): void {
    localStorage.setItem(this.STORAGE_KEY, role);
  }

  clearRole(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  hasRole(role: Role): boolean {
    return this.getRole() === role;
  }

  hasAnyRole(roles: Role[]): boolean {
    const userRole = this.getRole();
    return userRole ? roles.includes(userRole) : false;
  }

  getAllRoles(): UserRole[] {
    return [
      {id: 1, code: Role.EN, name: 'English'},
      {id: 2, code: Role.FR, name: 'Français'},
      {id: 3, code: Role.DE, name: 'Deutsch'}
    ];
  }
}
