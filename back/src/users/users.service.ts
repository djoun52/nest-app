import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { forgetPassAsk, forgetPassChange } from './dto';
import randomBytes from 'randombytes';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async isVerify(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user.is_verifed === true ? true : false;
  }

  async forgetPassword(dto: forgetPassAsk) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (user.hashedRt !== null) {
      throw new ForbiddenException('User already connected');
    }

    if (!user) {
      throw new ForbiddenException("Email doesn't have a account");
    }

    const checkPasswordResetToken =
      await this.prisma.passwordResetToken.findUnique({
        where: {
          userId: user.id,
        },
      });

    if (checkPasswordResetToken) {
      const tokenDuration =
        Date.now() - Date.parse(checkPasswordResetToken.createdAt.toString());
      if (tokenDuration > 3600000) {
        await this.prisma.emailVerificationToken.delete({
          where: { id: checkPasswordResetToken.id },
        });
      } else {
        throw new ForbiddenException('your last token is still valid');
      }
    }

    const token: string = await randomBytes(16).toString('hex');

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: token,
      },
    });

    await this.mailService.sendForgetPasswordLink(user, token);

    return {
      token: token,
      mess: 'email send',
    };
  }

  async isValidPassResetToken(dto: forgetPassChange) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: dto.id,
      },
    });

    if (!user) {
      throw new ForbiddenException('no user has this id');
    }
    const PasswordResetToken = await this.prisma.passwordResetToken.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (dto.token !== PasswordResetToken.token) {
      throw new ForbiddenException(' wrong token');
    }

    if (PasswordResetToken) {
      const tokenDuration =
        Date.now() - Date.parse(PasswordResetToken.createdAt.toString());
      if (tokenDuration > 3600000) {
        throw new ForbiddenException('your token is expired');
      }

      return true;
    }
  }
}
