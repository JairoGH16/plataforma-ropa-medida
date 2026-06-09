import { Controller, Get, Param } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(private manufacturers: ManufacturersService) {}

  @Get()
  findAll() {
    return this.manufacturers.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manufacturers.findById(id);
  }
}
