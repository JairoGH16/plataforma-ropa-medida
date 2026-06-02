import { Test } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';

jest.mock('../../../shared/prisma/prisma.service', () => ({
  PrismaService: class {},
}));

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  password: '',
  role: 'CLIENT',
  phone: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockJwt = {
  sign: jest.fn().mockReturnValue('mock-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return a token', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        ...mockUser,
        password: 'hashed',
      });

      const result = await service.register({
        email: 'test@example.com',
        name: 'Test User',
        password: 'pass123',
      });

      expect(result.token).toBe('mock-token');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.register({
          email: 'test@example.com',
          name: 'Test',
          password: 'pass',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login and return a token with valid credentials', async () => {
      const hashed = await bcrypt.hash('pass123', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        password: hashed,
      });

      const result = await service.login({
        email: 'test@example.com',
        password: 'pass123',
      });

      expect(result.token).toBe('mock-token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'x@x.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      const hashed = await bcrypt.hash('correct', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        password: hashed,
      });

      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
