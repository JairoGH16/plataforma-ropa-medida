import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../../shared/guards/jwt.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: { sub: string }) {
    return this.users.findById(user.sub);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: { sub: string }, @Body() dto: UpdateUserDto) {
    return this.users.update(user.sub, dto);
  }
}
