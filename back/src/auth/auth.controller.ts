import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto, LoginDto, TokenDto } from './dto';
import {
  Public,
  GetCurrentUserIdRt,
  GetCurrentUser,
  GetCurrentUserIdAt,
} from '../decorator';
import { Tokens } from './types';
import { RtGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signUp')
  signUp(@Body() dto: AuthDto) {
    if (dto.password === dto.checkPass) {
      return this.authService.signUp(dto);
    } else {
      return 'password and checkPass not equal';
    }
  }

  @Public()
  @Post('signIn')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() dto: LoginDto) {
    return this.authService.signIn(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserIdAt() userId: number): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserIdRt() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Public()
  @Post('verifTokenAccount')
  @HttpCode(HttpStatus.OK)
  verifTokenAccount(@Body() dto: TokenDto) {
    return this.authService.verifTokenAccount(dto);
  }

  @Post('sendEmailVerifAccount')
  @HttpCode(HttpStatus.OK)
  SendEmailVerifyAccount(@GetCurrentUserIdAt() userId: number) {
    return this.authService.reSendEmailVerifyAccount(userId);
  }
}
