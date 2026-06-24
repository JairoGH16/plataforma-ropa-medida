export type QuoteStatus = 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';

export interface QuoteMeasurement {
  talla: string | null;
  cuello: number | null;
  pecho: number | null;
  cintura: number | null;
  cadera: number | null;
  largoManga: number | null;
  largoPierna: number | null;
}

export interface QuoteRequest {
  id: string;
  clientId: string;
  manufacturerId: string;
  garmentType: string;
  description: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    measurement: QuoteMeasurement | null;
  };
  manufacturer: { id: string; name: string; email: string };
}

export interface CreateQuoteDto {
  manufacturerId: string;
  garmentType: string;
  description: string;
}
