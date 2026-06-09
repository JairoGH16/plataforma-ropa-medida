import { getManufacturers, getManufacturerById, getMyManufacturerProfile, saveMyManufacturerProfile } from '../services/manufacturers.service';

const mockProfile = {
  id: 'p-1', userId: 'm-1', specialty: 'Sastrería formal',
  garmentTypes: 'Trajes, Camisas', description: 'Expertos en ropa formal.',
  location: 'San José', experience: 20,
  createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
};

const mockManufacturer = {
  id: 'm-1', name: 'Sastrería García', email: 'garcia@example.com',
  phone: '8888-0001', createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z', manufacturerProfile: mockProfile,
};

global.fetch = jest.fn();

function mockFetch(data: unknown, ok = true) {
  const body = data === null ? '' : JSON.stringify(data);
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    text: async () => body,
    json: async () => data,
  });
}

describe('manufacturers.service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getManufacturers', () => {
    it('returns list of manufacturers with profiles', async () => {
      mockFetch([mockManufacturer]);
      const result = await getManufacturers();
      expect(result).toHaveLength(1);
      expect(result[0].manufacturerProfile?.specialty).toBe('Sastrería formal');
    });

    it('returns empty array when no manufacturers', async () => {
      mockFetch([]);
      const result = await getManufacturers();
      expect(result).toHaveLength(0);
    });

    it('throws on failure', async () => {
      mockFetch({}, false);
      await expect(getManufacturers()).rejects.toThrow('Failed to fetch manufacturers');
    });
  });

  describe('getManufacturerById', () => {
    it('returns a manufacturer with profile', async () => {
      mockFetch(mockManufacturer);
      const result = await getManufacturerById('m-1');
      expect(result.manufacturerProfile?.location).toBe('San José');
    });

    it('throws when not found', async () => {
      mockFetch({}, false);
      await expect(getManufacturerById('unknown')).rejects.toThrow('Manufacturer not found');
    });
  });

  describe('getMyManufacturerProfile', () => {
    it('returns profile on success', async () => {
      mockFetch(mockProfile);
      const result = await getMyManufacturerProfile('tok');
      expect(result?.specialty).toBe('Sastrería formal');
    });

    it('returns null when no profile exists', async () => {
      mockFetch(null);
      const result = await getMyManufacturerProfile('tok');
      expect(result).toBeNull();
    });

    it('throws on failure', async () => {
      mockFetch({}, false);
      await expect(getMyManufacturerProfile('tok')).rejects.toThrow('Failed to fetch profile');
    });
  });

  describe('saveMyManufacturerProfile', () => {
    it('saves and returns the updated profile', async () => {
      mockFetch(mockProfile);
      const result = await saveMyManufacturerProfile('tok', { specialty: 'Sastrería formal' });
      expect(result.specialty).toBe('Sastrería formal');
    });

    it('throws on failure', async () => {
      mockFetch({}, false);
      await expect(saveMyManufacturerProfile('tok', {})).rejects.toThrow('Failed to save profile');
    });
  });
});
