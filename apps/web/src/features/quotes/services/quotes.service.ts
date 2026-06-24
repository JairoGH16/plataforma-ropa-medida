import { QuoteRequest, CreateQuoteDto } from '../types/quote.types';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function createQuote(token: string, data: CreateQuoteDto): Promise<QuoteRequest> {
  const res = await fetch(`${API}/quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('No se pudo enviar la solicitud');
  return res.json() as Promise<QuoteRequest>;
}

export async function getMyQuotes(token: string): Promise<QuoteRequest[]> {
  const res = await fetch(`${API}/quotes/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('No se pudieron cargar las solicitudes');
  return res.json() as Promise<QuoteRequest[]>;
}

export async function getReceivedQuotes(token: string): Promise<QuoteRequest[]> {
  const res = await fetch(`${API}/quotes/received`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('No se pudieron cargar las solicitudes');
  return res.json() as Promise<QuoteRequest[]>;
}

export async function updateQuoteStatus(
  token: string,
  id: string,
  status: string,
): Promise<QuoteRequest> {
  const res = await fetch(`${API}/quotes/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('No se pudo actualizar el estado');
  return res.json() as Promise<QuoteRequest>;
}
