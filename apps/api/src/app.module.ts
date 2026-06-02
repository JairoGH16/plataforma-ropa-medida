import { Module } from '@nestjs/common';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { MeasurementsModule } from './features/measurements/measurements.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, MeasurementsModule],
})
export class AppModule {}
