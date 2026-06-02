import { getMyMeasurements, saveMeasurements } from '../services/measurements.service';

const mockMeasurement = {
  id: 'm-1', userId: 'u-1', talla: 'M',
  cuello: 38, pecho: 95, cintura: 80, cadera: 95,
  largoManga: 62, largoPierna: 100,
  createdAt: '', updatedAt: '',
};

global.fetch = jest.fn();

function mockFetch(data: unknown, ok = true) {
  (fetch as jest.Mock).mockResolvedValueOnce({ ok, json: async () => data });
}

describe('measurements.service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getMyMeasurements', () => {
    it('returns measurements on success', async () => {
      mockFetch(mockMeasurement);
      const result = await getMyMeasurements('tok');
      expect(result?.talla).toBe('M');
      expect(result?.pecho).toBe(95);
    });

    it('returns null when no measurements exist', async () => {
      mockFetch(null);
      const result = await getMyMeasurements('tok');
      expect(result).toBeNull();
    });

    it('throws on failure', async () => {
      mockFetch({}, false);
      await expect(getMyMeasurements('tok')).rejects.toThrow('Failed to fetch measurements');
    });
  });

  describe('saveMeasurements', () => {
    it('saves and returns updated measurements', async () => {
      mockFetch(mockMeasurement);
      const result = await saveMeasurements('tok', { talla: 'M', pecho: 95 });
      expect(result.talla).toBe('M');
    });

    it('throws on failure', async () => {
      mockFetch({}, false);
      await expect(saveMeasurements('tok', {})).rejects.toThrow('Failed to save measurements');
    });
  });
});
