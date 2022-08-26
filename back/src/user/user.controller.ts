import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { AtGuard } from '../auth/guards';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { GetCurrentUser } from '../auth/decorator';

@UseGuards(AtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetCurrentUser() user: User) {
    return user;
  }
}
