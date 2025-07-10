# Gestion des Rôles

Ce document décrit le système de gestion des rôles de l'application.

## Rôles disponibles

| ID | Code | Description       |
|----|------|-------------------|
| 1  | EN   | Utilisateur Anglais |
| 2  | FR   | Utilisateur Français|
| 3  | DE   | Utilisateur Allemand|

## Services

### RoleService

Service central pour la gestion des rôles.

#### Méthodes

- `getRole(): Role | null` - Récupère le rôle actuel de l'utilisateur
- `setRole(role: Role): void` - Définit le rôle de l'utilisateur
- `clearRole(): void` - Supprime le rôle de l'utilisateur
- `hasRole(role: Role): boolean` - Vérifie si l'utilisateur a un rôle spécifique
- `hasAnyRole(roles: Role[]): boolean` - Vérifie si l'utilisateur a l'un des rôles spécifiés
- `getAllRoles(): UserRole[]` - Récupère la liste de tous les rôles disponibles

## Guards

### roleGuard

Protège les routes en fonction des rôles autorisés.

#### Utilisation

```typescript
const routes: Routes = [
  {
    path: 'admin',
    canActivate: [roleGuard([Role.ADMIN, Role.SUPER_ADMIN])],
    component: AdminComponent
  }
];
```

## Intégration avec l'authentification

Le service d'authentification (`AuthService`) intègre automatiquement la gestion des rôles lors de la connexion et de la déconnexion.

## Bonnes pratiques

1. Toujours utiliser l'enum `Role` au lieu de chaînes en dur
2. Utiliser `hasAnyRole` pour vérifier plusieurs rôles
3. Définir les autorisations au niveau des routes pour une meilleure maintenabilité
4. Utiliser le guard `roleGuard` pour protéger les routes sensibles
