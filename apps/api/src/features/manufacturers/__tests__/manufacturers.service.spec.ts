import { Test } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ManufacturersService } from '../manufacturers.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';

jest.mock('../../../shared/prisma/prisma.service');

const mockProfile = {
  id: 'p-1',
  userId: 'm-1',
  specialty: 'Sastrería formal',
  garmentTypes: 'Trajes, Camisas',
  description: 'Expertos en ropa formal.',
  location: 'San José',
  experience: 20,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockManufacturer = {
  id: 'm-1',
  name: 'Sastrería García',
  email: 'garcia@example.com',
  phone: '8888-0001',
  createdAt: new Date(),
  updatedAt: new Date(),
  manufacturerProfile: mockProfile,
};

const mockPrisma = {
  user: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
  },
  manufacturerProfile: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
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
    it('returns list of manufacturers with profiles', async () => {
      mockPrisma.user.findMany.mockResolvedValue([mockManufacturer]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].manufacturerProfile?.specialty).toBe('Sastrería formal');
    });

    it('returns empty array when no manufacturers exist', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('returns a manufacturer with profile by id', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(mockManufacturer);
      const result = await service.findById('m-1');
      expect(result.name).toBe('Sastrería García');
      expect(result.manufacturerProfile?.location).toBe('San José');
    });

    it('throws NotFoundException when manufacturer not found', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      await expect(service.findById('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getMyProfile', () => {
    it('returns profile for a manufacturer', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ role: 'MANUFACTURER' });
      mockPrisma.manufacturerProfile.findUnique.mockResolvedValue(mockProfile);
      const result = await service.getMyProfile('m-1');
      expect(result?.specialty).toBe('Sastrería formal');
    });

    it('throws ForbiddenException for non-manufacturer', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ role: 'CLIENT' });
      await expect(service.getMyProfile('c-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getSuggestions', () => {
    const manufacturers = [
      {
        ...mockManufacturer,
        id: 'm-1',
        manufacturerProfile: { ...mockProfile, garmentTypes: 'Trajes, Camisas', experience: 20 },
      },
      {
        ...mockManufacturer,
        id: 'm-2',
        name: 'Confecciones Mora',
        manufacturerProfile: { ...mockProfile, garmentTypes: 'Pantalones, Camisas', experience: 5 },
      },
      {
        ...mockManufacturer,
        id: 'm-3',
        name: 'Taller Vargas',
        manufacturerProfile: { ...mockProfile, garmentTypes: 'Uniformes', experience: 3 },
      },
    ];

    it('returns only manufacturers matching the garment type', async () => {
      mockPrisma.user.findMany.mockResolvedValue(manufacturers);
      const result = await service.getSuggestions('Camisas');
      expect(result).toHaveLength(2);
      expect(result.every((m) => ['m-1', 'm-2'].includes(m.id))).toBe(true);
    });

    it('orders results by score descending (experience as tiebreaker)', async () => {
      mockPrisma.user.findMany.mockResolvedValue(manufacturers);
      const result = await service.getSuggestions('Camisas');
      expect(result[0].id).toBe('m-1');
    });

    it('returns empty array when no manufacturer matches', async () => {
      mockPrisma.user.findMany.mockResolvedValue(manufacturers);
      const result = await service.getSuggestions('Vestidos');
      expect(result).toHaveLength(0);
    });

    it('excludes manufacturers without profile', async () => {
      const withoutProfile = { ...mockManufacturer, id: 'm-4', manufacturerProfile: null };
      mockPrisma.user.findMany.mockResolvedValue([...manufacturers, withoutProfile]);
      const result = await service.getSuggestions('Camisas');
      expect(result.every((m) => m.id !== 'm-4')).toBe(true);
    });
  });

  describe('upsertMyProfile', () => {
    it('saves and returns the profile', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ role: 'MANUFACTURER' });
      mockPrisma.manufacturerProfile.upsert.mockResolvedValue(mockProfile);
      const result = await service.upsertMyProfile('m-1', {
        specialty: 'Sastrería formal',
      });
      expect(result.specialty).toBe('Sastrería formal');
    });

    it('throws ForbiddenException for non-manufacturer', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ role: 'CLIENT' });
      await expect(service.upsertMyProfile('c-1', {})).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
