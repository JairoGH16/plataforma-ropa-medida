import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';

const CLIENT_INCLUDE = {
  client: { select: { id: true, name: true, email: true, phone: true } },
  manufacturer: { select: { id: true, name: true, email: true } },
};

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async create(clientId: string, dto: CreateQuoteDto) {
    const manufacturer = await this.prisma.user.findFirst({
      where: { id: dto.manufacturerId, role: 'MANUFACTURER' },
    });
    if (!manufacturer) throw new NotFoundException('Manufacturer not found');

    return this.prisma.quoteRequest.create({
      data: {
        clientId,
        manufacturerId: dto.manufacturerId,
        garmentType: dto.garmentType,
        description: dto.description,
      },
      include: CLIENT_INCLUDE,
    });
  }

  getMyQuotesAsClient(clientId: string) {
    return this.prisma.quoteRequest.findMany({
      where: { clientId },
      include: CLIENT_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyQuotesAsManufacturer(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user || user.role !== 'MANUFACTURER') throw new ForbiddenException();

    return this.prisma.quoteRequest.findMany({
      where: { manufacturerId: userId },
      include: CLIENT_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, manufacturerId: string, status: string) {
    const quote = await this.prisma.quoteRequest.findUnique({ where: { id } });
    if (!quote) throw new NotFoundException('Quote not found');
    if (quote.manufacturerId !== manufacturerId) throw new ForbiddenException();

    return this.prisma.quoteRequest.update({
      where: { id },
      data: {
        status: status as 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED',
      },
      include: CLIENT_INCLUDE,
    });
  }
}
