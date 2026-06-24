import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { JwtGuard } from '../../shared/guards/jwt.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@Controller('quotes')
@UseGuards(JwtGuard)
export class QuotesController {
  constructor(private quotes: QuotesService) {}

  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateQuoteDto) {
    return this.quotes.create(user.sub, dto);
  }

  @Get('my')
  getMyQuotes(@CurrentUser() user: { sub: string }) {
    return this.quotes.getMyQuotesAsClient(user.sub);
  }

  @Get('received')
  getReceivedQuotes(@CurrentUser() user: { sub: string }) {
    return this.quotes.getMyQuotesAsManufacturer(user.sub);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string },
    @Body('status') status: string,
  ) {
    return this.quotes.updateStatus(id, user.sub, status);
  }
}
