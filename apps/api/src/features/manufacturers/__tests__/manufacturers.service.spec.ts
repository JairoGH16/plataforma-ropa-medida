import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ManufacturersService } from '../manufacturers.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';

jest.mock('../../../shared/prisma/prisma.service');

const mockManufacturer = {
  id: 'm-1',
  name: 'Sastrería García',
  email: 'garcia@example.com',
  phone: '8888-0000',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  user: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
};

describe('ManufacturersService', () => {
  let service: ManufacturersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ManufacturersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get(ManufacturersService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns list of manufacturers', async () => {
      mockPrisma.user.findMany.mockResolvedValue([mockManufacturer]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Sastrería García');
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { role: 'MANUFACTURER' } }),
      );
    });

    it('returns empty array when no manufacturers exist', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('returns a manufacturer by id', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(mockManufacturer);
      const result = await service.findById('m-1');
      expect(result.name).toBe('Sastrería García');
    });

    it('throws NotFoundException when manufacturer not found', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      await expect(service.findById('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
