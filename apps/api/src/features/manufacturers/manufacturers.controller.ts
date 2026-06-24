import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { UpsertProfileDto } from './dto/upsert-profile.dto';
import { JwtGuard } from '../../shared/guards/jwt.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(private manufacturers: ManufacturersService) {}

  @Get()
  findAll() {
    return this.manufacturers.findAll();
  }

  @Get('suggestions')
  getSuggestions(@Query('garmentType') garmentType: string) {
    return this.manufacturers.getSuggestions(garmentType ?? '');
  }

  @Get('me/profile')
  @UseGuards(JwtGuard)
  getMyProfile(@CurrentUser() user: { sub: string }) {
    return this.manufacturers.getMyProfile(user.sub);
  }

  @Patch('me/profile')
  @UseGuards(JwtGuard)
  upsertMyProfile(
    @CurrentUser() user: { sub: string },
    @Body() dto: UpsertProfileDto,
  ) {
    return this.manufacturers.upsertMyProfile(user.sub, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manufacturers.findById(id);
  }
}
