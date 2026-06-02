import { AuthResponse, User } from '../types/auth.types';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function register(data: { email: string; name: string; password: string; phone?: string }): Promise<AuthResponse> {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message ?? 'Registration failed');
  return res.json();
}

export async function login(data: { email: string; password: string }): Promise<AuthResponse> {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message ?? 'Login failed');
  return res.json();
}

export async function getMe(token: string): Promise<User> {
  const res = await fetch(`${API}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function updateMe(token: string, data: { name?: string; phone?: string }): Promise<User> {
  const res = await fetch(`${API}/users/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}
