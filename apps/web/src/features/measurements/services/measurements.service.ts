import { Measurement, UpsertMeasurementDto } from '../types/measurement.types';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function getMyMeasurements(token: string): Promise<Measurement | null> {
  const res = await fetch(`${API}/measurements/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch measurements');
  return res.json() as Promise<Measurement | null>;
}

export async function saveMeasurements(token: string, data: UpsertMeasurementDto): Promise<Measurement> {
  const res = await fetch(`${API}/measurements/me`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save measurements');
  return res.json() as Promise<Measurement>;
}
