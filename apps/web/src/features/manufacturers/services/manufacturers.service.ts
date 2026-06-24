import { Manufacturer, ManufacturerProfile, UpsertProfileDto } from '../types/manufacturer.types';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function getManufacturers(): Promise<Manufacturer[]> {
  const res = await fetch(`${API}/manufacturers`);
  if (!res.ok) throw new Error('Failed to fetch manufacturers');
  return res.json() as Promise<Manufacturer[]>;
}

export async function getManufacturerById(id: string): Promise<Manufacturer> {
  const res = await fetch(`${API}/manufacturers/${id}`);
  if (!res.ok) throw new Error('Manufacturer not found');
  return res.json() as Promise<Manufacturer>;
}

export async function getManufacturerSuggestions(garmentType: string): Promise<Manufacturer[]> {
  const res = await fetch(
    `${API}/manufacturers/suggestions?garmentType=${encodeURIComponent(garmentType)}`,
  );
  if (!res.ok) throw new Error('Failed to fetch suggestions');
  return res.json() as Promise<Manufacturer[]>;
}

export async function getMyManufacturerProfile(token: string): Promise<ManufacturerProfile | null> {
  const res = await fetch(`${API}/manufacturers/me/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text) as ManufacturerProfile | null;
}

export async function saveMyManufacturerProfile(token: string, data: UpsertProfileDto): Promise<ManufacturerProfile> {
  const res = await fetch(`${API}/manufacturers/me/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save profile');
  return res.json() as Promise<ManufacturerProfile>;
}
