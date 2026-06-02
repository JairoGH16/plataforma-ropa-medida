export interface Measurement {
  id: string;
  userId: string;
  talla: string | null;
  cuello: number | null;
  pecho: number | null;
  cintura: number | null;
  cadera: number | null;
  largoManga: number | null;
  largoPierna: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertMeasurementDto {
  talla?: string;
  cuello?: number;
  pecho?: number;
  cintura?: number;
  cadera?: number;
  largoManga?: number;
  largoPierna?: number;
}
