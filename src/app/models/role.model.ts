export enum Role {
  EN = 'EN',
  FR = 'FR',
  DE = 'DE'
}

export const RoleLabel: Record<Role, string> = {
  [Role.EN]: 'English',
  [Role.FR]: 'Français',
  [Role.DE]: 'Deutsch'
};

export interface UserRole {
  id: number;
  code: Role;
  name: string;
}
