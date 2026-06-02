export type UserRole = 'CLIENT' | 'MANUFACTURER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
