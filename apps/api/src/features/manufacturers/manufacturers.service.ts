import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

const SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class ManufacturersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      where: { role: 'MANUFACTURER' },
      select: SELECT,
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const manufacturer = await this.prisma.user.findFirst({
      where: { id, role: 'MANUFACTURER' },
      select: SELECT,
    });
    if (!manufacturer) throw new NotFoundException('Manufacturer not found');
    return manufacturer;
  }
}
