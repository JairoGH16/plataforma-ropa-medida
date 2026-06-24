export type QuoteStatus = 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';

export interface QuoteRequest {
  id: string;
  clientId: string;
  manufacturerId: string;
  garmentType: string;
  description: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
  client: { id: string; name: string; email: string; phone: string | null };
  manufacturer: { id: string; name: string; email: string };
}

export interface CreateQuoteDto {
  manufacturerId: string;
  garmentType: string;
  description: string;
}
