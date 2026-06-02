import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UpsertMeasurementDto } from './dto/upsert-measurement.dto';

@Injectable()
export class MeasurementsService {
  constructor(private prisma: PrismaService) {}

  async getByUser(userId: string) {
    return this.prisma.measurement.findUnique({ where: { userId } });
  }

  async upsert(userId: string, dto: UpsertMeasurementDto) {
    return this.prisma.measurement.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
    });
  }
}
