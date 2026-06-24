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

  async getSuggestions(garmentType: string) {
    const all = await this.prisma.user.findMany({
      where: { role: 'MANUFACTURER' },
      select: WITH_PROFILE,
    });

    const query = garmentType.toLowerCase().trim();

    const scored = all
      .filter((m) => m.manufacturerProfile)
      .map((m) => {
        const profile = m.manufacturerProfile!;
        const types = (profile.garmentTypes ?? '')
          .split(',')
          .map((t) => t.trim().toLowerCase());
        const exactMatch = types.includes(query);
        const partialMatch = !exactMatch && types.some((t) => t.includes(query));
        const matchScore = exactMatch ? 100 : partialMatch ? 50 : 0;
        const score = matchScore + (profile.experience ?? 0);
        return { ...m, score, matchScore };
      })
      .filter((m) => m.matchScore > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ score: _score, matchScore: _matchScore, ...m }) => m);

    return scored;
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
