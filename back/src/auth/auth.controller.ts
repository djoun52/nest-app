import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto, TokenDto } from './dto';
import {
  Public,
  GetCurrentUserId,
  GetCurrentUser,
  GetCurrentUserLg,
} from './decorator';
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
  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  signIn(@Body() dto: LoginDto) {
    return this.authService.signIn(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserLg() userId: number): Promise<boolean> {
    console.log(userId);
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('verifTokenAccount')
  verifTokenAccount(@Body() dto: TokenDto) {
    return this.authService.verifTokenAccount(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sendEmailVerifAccount')
  SendEmailVerifyAccount(@GetCurrentUserId() userId: number) {
    return this.authService.reSendEmailVerifyAccount(userId);
  }
}
