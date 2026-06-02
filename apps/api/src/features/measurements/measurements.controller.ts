import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { UpsertMeasurementDto } from './dto/upsert-measurement.dto';
import { JwtGuard } from '../../shared/guards/jwt.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@UseGuards(JwtGuard)
@Controller('measurements')
export class MeasurementsController {
  constructor(private measurements: MeasurementsService) {}

  @Get('me')
  getMyMeasurements(@CurrentUser() user: { sub: string }) {
    return this.measurements.getByUser(user.sub);
  }

  @Post('me')
  upsertMyMeasurements(
    @CurrentUser() user: { sub: string },
    @Body() dto: UpsertMeasurementDto,
  ) {
    return this.measurements.upsert(user.sub, dto);
  }
}
