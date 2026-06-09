import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UpsertProfileDto } from './dto/upsert-profile.dto';

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  createdAt: true,
  updatedAt: true,
};

const WITH_PROFILE = {
  ...USER_SELECT,
  manufacturerProfile: true,
};

@Injectable()
export class ManufacturersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      where: { role: 'MANUFACTURER' },
      select: WITH_PROFILE,
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const manufacturer = await this.prisma.user.findFirst({
      where: { id, role: 'MANUFACTURER' },
      select: WITH_PROFILE,
    });
    if (!manufacturer) throw new NotFoundException('Manufacturer not found');
    return manufacturer;
  }

  async getMyProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user || user.role !== 'MANUFACTURER') throw new ForbiddenException();
    return this.prisma.manufacturerProfile.findUnique({ where: { userId } });
  }

  async upsertMyProfile(userId: string, dto: UpsertProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user || user.role !== 'MANUFACTURER') throw new ForbiddenException();
    return this.prisma.manufacturerProfile.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
    });
  }
}
