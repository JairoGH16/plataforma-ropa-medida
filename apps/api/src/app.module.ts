import { Module } from '@nestjs/common';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { MeasurementsModule } from './features/measurements/measurements.module';
import { ManufacturersModule } from './features/manufacturers/manufacturers.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    MeasurementsModule,
    ManufacturersModule,
  ],
})
export class AppModule {}
