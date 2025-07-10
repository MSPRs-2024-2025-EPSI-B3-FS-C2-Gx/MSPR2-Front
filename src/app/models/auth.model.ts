export interface User {
  id_user: number;
  email: string;
  role: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
