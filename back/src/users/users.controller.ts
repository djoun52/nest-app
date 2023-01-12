import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { GetCurrentUserIdAt, Public } from '../common/decorator';
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
  @Post('forgetPasswordAsk')
  @HttpCode(HttpStatus.OK)
  forgetPassword(@Body() dto: forgetPassAsk) {
    return this.usersService.forgetPasswordAsk(dto);
  }

  @Public()
  @Post('forgetPasswordChange')
  @HttpCode(HttpStatus.OK)
  forgetPasswordChange(@Body() dto: forgetPassChange) {
    return this.usersService.forgetPasswordChange(dto);
  }
}
