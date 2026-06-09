import { Manufacturer } from '../types/manufacturer.types';

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
