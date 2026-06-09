export interface ManufacturerProfile {
  id: string;
  userId: string;
  specialty: string | null;
  garmentTypes: string | null;
  description: string | null;
  location: string | null;
  experience: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Manufacturer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  manufacturerProfile: ManufacturerProfile | null;
}

export interface UpsertProfileDto {
  specialty?: string;
  garmentTypes?: string;
  description?: string;
  location?: string;
  experience?: number;
}
