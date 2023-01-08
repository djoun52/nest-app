import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { GetCurrentUserIdAt, Public } from '../decorator';
import { forgetPassAsk, forgetPassChange } from './dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('isVerify')
  @HttpCode(HttpStatus.OK)
  userIsVerify(@GetCurrentUserIdAt() userId: number) {
    return this.usersService.isVerify(userId);
  }

  @Public()
  @Post('forgetPassword')
  @HttpCode(HttpStatus.OK)
  forgetPassword(@Body() dto: forgetPassAsk) {
    return this.usersService.forgetPassword(dto);
  }

  @Public()
  @Post('forgetPasswordChange')
  @HttpCode(HttpStatus.OK)
  forgetPasswordChange(@Body() dto: forgetPassChange) {
    if (this.usersService.isValidPassResetToken(dto)) {
      // this.usersService.changePassword(dto);
    }
  }
}
