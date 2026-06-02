export type UserRole = 'client' | 'manufacturer' | 'admin';

export interface BaseUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}
