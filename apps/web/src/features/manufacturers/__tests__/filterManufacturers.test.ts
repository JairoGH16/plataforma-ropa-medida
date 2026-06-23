import {
  filterManufacturers,
  extractLocations,
  extractGarmentTypes,
} from '../utils/filterManufacturers';
import { Manufacturer } from '../types/manufacturer.types';

const base = (overrides: Partial<Manufacturer> = {}): Manufacturer => ({
  id: '1',
  name: 'Sastrería García',
  email: 'garcia@ropa.dev',
  phone: null,
  createdAt: '',
  updatedAt: '',
  manufacturerProfile: {
    id: 'p1',
    userId: '1',
    specialty: 'Sastrería formal',
    garmentTypes: 'Camisas, Trajes',
    description: null,
    location: 'San José',
    experience: 10,
    createdAt: '',
    updatedAt: '',
  },
  ...overrides,
});

const MANUFACTURERS: Manufacturer[] = [
  base({ id: '1', name: 'Sastrería García' }),
  base({
    id: '2',
    name: 'Confecciones Mora',
    manufacturerProfile: {
      id: 'p2', userId: '2', specialty: 'Ropa casual',
      garmentTypes: 'Pantalones, Camisas', description: null,
      location: 'Alajuela', experience: 5, createdAt: '', updatedAt: '',
    },
  }),
  base({
    id: '3',
    name: 'Taller Vargas',
    manufacturerProfile: {
      id: 'p3', userId: '3', specialty: 'Uniformes',
      garmentTypes: 'Uniformes', description: null,
      location: 'Heredia', experience: 3, createdAt: '', updatedAt: '',
    },
  }),
];

const empty = { query: '', location: '', garmentType: '', minExperience: '' };

describe('filterManufacturers', () => {
  it('returns all manufacturers when filters are empty', () => {
    expect(filterManufacturers(MANUFACTURERS, empty)).toHaveLength(3);
  });

  it('filters by name query (case insensitive)', () => {
    const result = filterManufacturers(MANUFACTURERS, { ...empty, query: 'garcía' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Sastrería García');
  });

  it('filters by specialty query', () => {
    const result = filterManufacturers(MANUFACTURERS, { ...empty, query: 'casual' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('filters by garment type', () => {
    const result = filterManufacturers(MANUFACTURERS, { ...empty, garmentType: 'Camisas' });
    expect(result).toHaveLength(2);
  });

  it('filters by location', () => {
    const result = filterManufacturers(MANUFACTURERS, { ...empty, location: 'Heredia' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('filters by minimum experience', () => {
    const result = filterManufacturers(MANUFACTURERS, { ...empty, minExperience: '6' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('combines multiple filters', () => {
    const result = filterManufacturers(MANUFACTURERS, {
      query: '',
      garmentType: 'Camisas',
      location: 'San José',
      minExperience: '5',
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('returns empty array when no manufacturers match', () => {
    const result = filterManufacturers(MANUFACTURERS, { ...empty, query: 'xyz123' });
    expect(result).toHaveLength(0);
  });

  it('excludes manufacturer with no profile when garmentType filter is set', () => {
    const noProfile: Manufacturer = { ...base({ id: '4', name: 'Sin perfil' }), manufacturerProfile: null };
    const result = filterManufacturers([...MANUFACTURERS, noProfile], { ...empty, garmentType: 'Camisas' });
    expect(result.every((m) => m.id !== '4')).toBe(true);
  });
});

describe('extractLocations', () => {
  it('returns unique sorted locations', () => {
    expect(extractLocations(MANUFACTURERS)).toEqual(['Alajuela', 'Heredia', 'San José']);
  });
});

describe('extractGarmentTypes', () => {
  it('returns unique sorted garment types', () => {
    expect(extractGarmentTypes(MANUFACTURERS)).toEqual(['Camisas', 'Pantalones', 'Trajes', 'Uniformes']);
  });
});
