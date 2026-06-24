import { Test } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { QuotesService } from '../quotes.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';

jest.mock('../../../shared/prisma/prisma.service');

const mockQuote = {
  id: 'q-1',
  clientId: 'c-1',
  manufacturerId: 'm-1',
  garmentType: 'Camisa',
  description: 'Camisa formal azul',
  status: 'PENDING' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  client: {
    id: 'c-1',
    name: 'Cliente Test',
    email: 'cliente@test.com',
    phone: null,
  },
  manufacturer: { id: 'm-1', name: 'Fabricante Test', email: 'fab@test.com' },
};

const mockPrisma = {
  user: { findFirst: jest.fn(), findUnique: jest.fn() },
  quoteRequest: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('QuotesService', () => {
  let service: QuotesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuotesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get(QuotesService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates and returns a quote request', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({
        id: 'm-1',
        role: 'MANUFACTURER',
      });
      mockPrisma.quoteRequest.create.mockResolvedValue(mockQuote);
      const result = await service.create('c-1', {
        manufacturerId: 'm-1',
        garmentType: 'Camisa',
        description: 'Camisa formal azul',
      });
      expect(result.status).toBe('PENDING');
      expect(result.garmentType).toBe('Camisa');
    });

    it('throws NotFoundException if manufacturer does not exist', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      await expect(
        service.create('c-1', {
          manufacturerId: 'bad',
          garmentType: 'X',
          description: 'X',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMyQuotesAsClient', () => {
    it('returns quotes for the client', async () => {
      mockPrisma.quoteRequest.findMany.mockResolvedValue([mockQuote]);
      const result = await service.getMyQuotesAsClient('c-1');
      expect(result).toHaveLength(1);
      expect(result[0].clientId).toBe('c-1');
    });
  });

  describe('getMyQuotesAsManufacturer', () => {
    it('returns received quotes for a manufacturer', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ role: 'MANUFACTURER' });
      mockPrisma.quoteRequest.findMany.mockResolvedValue([mockQuote]);
      const result = await service.getMyQuotesAsManufacturer('m-1');
      expect(result).toHaveLength(1);
    });

    it('throws ForbiddenException for non-manufacturer', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ role: 'CLIENT' });
      await expect(service.getMyQuotesAsManufacturer('c-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('updateStatus', () => {
    it('updates and returns the quote with new status', async () => {
      mockPrisma.quoteRequest.findUnique.mockResolvedValue(mockQuote);
      mockPrisma.quoteRequest.update.mockResolvedValue({
        ...mockQuote,
        status: 'ACCEPTED',
      });
      const result = await service.updateStatus('q-1', 'm-1', 'ACCEPTED');
      expect(result.status).toBe('ACCEPTED');
    });

    it('throws NotFoundException if quote does not exist', async () => {
      mockPrisma.quoteRequest.findUnique.mockResolvedValue(null);
      await expect(
        service.updateStatus('bad', 'm-1', 'ACCEPTED'),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException if manufacturer does not own the quote', async () => {
      mockPrisma.quoteRequest.findUnique.mockResolvedValue(mockQuote);
      await expect(
        service.updateStatus('q-1', 'other-m', 'ACCEPTED'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
