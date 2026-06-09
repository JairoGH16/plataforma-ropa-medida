import { getManufacturers, getManufacturerById } from '../services/manufacturers.service';

const mockManufacturer = {
  id: 'm-1',
  name: 'Sastrería García',
  email: 'garcia@example.com',
  phone: '8888-0000',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

global.fetch = jest.fn();

function mockFetch(data: unknown, ok = true) {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    json: async () => data,
  });
}

describe('manufacturers.service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getManufacturers', () => {
    it('returns list of manufacturers on success', async () => {
      mockFetch([mockManufacturer]);
      const result = await getManufacturers();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Sastrería García');
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
    it('returns a manufacturer by id', async () => {
      mockFetch(mockManufacturer);
      const result = await getManufacturerById('m-1');
      expect(result.id).toBe('m-1');
      expect(result.email).toBe('garcia@example.com');
    });

    it('throws when manufacturer not found', async () => {
      mockFetch({}, false);
      await expect(getManufacturerById('unknown')).rejects.toThrow('Manufacturer not found');
    });
  });
});
