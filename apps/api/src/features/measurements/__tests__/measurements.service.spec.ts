import { Test } from '@nestjs/testing';
import { MeasurementsService } from '../measurements.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';

jest.mock('../../../shared/prisma/prisma.service');

const mockMeasurement = {
  id: 'm-1',
  userId: 'user-1',
  talla: 'M',
  cuello: 38,
  pecho: 95,
  cintura: 80,
  cadera: 95,
  largoManga: 62,
  largoPierna: 100,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  measurement: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
  },
};

describe('MeasurementsService', () => {
  let service: MeasurementsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MeasurementsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get(MeasurementsService);
    jest.clearAllMocks();
  });

  describe('getByUser', () => {
    it('should return measurements for a user', async () => {
      mockPrisma.measurement.findUnique.mockResolvedValue(mockMeasurement);
      const result = await service.getByUser('user-1');
      expect(result).toEqual(mockMeasurement);
      expect(mockPrisma.measurement.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
    });

    it('should return null if no measurements exist', async () => {
      mockPrisma.measurement.findUnique.mockResolvedValue(null);
      const result = await service.getByUser('user-1');
      expect(result).toBeNull();
    });
  });

  describe('upsert', () => {
    it('should create measurements if none exist', async () => {
      mockPrisma.measurement.upsert.mockResolvedValue(mockMeasurement);
      const dto = { talla: 'M', pecho: 95, cintura: 80 };
      const result = await service.upsert('user-1', dto);
      expect(result).toEqual(mockMeasurement);
      expect(mockPrisma.measurement.upsert).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        update: dto,
        create: { userId: 'user-1', ...dto },
      });
    });

    it('should update existing measurements', async () => {
      const updated = { ...mockMeasurement, cintura: 75 };
      mockPrisma.measurement.upsert.mockResolvedValue(updated);
      const result = await service.upsert('user-1', { cintura: 75 });
      expect(result.cintura).toBe(75);
    });
  });
});
