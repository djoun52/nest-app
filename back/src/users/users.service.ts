import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { forgetPassAsk, forgetPassChange } from './dto';
import randomBytes from 'randombytes';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

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

  async forgetPasswordAsk(dto: forgetPassAsk) {
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
          where: { userId: user.id },
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

  async changePassword(password: string, user: User) {
    if (password.length < 8 || password.length > 35) {
      throw new ForbiddenException(
        'le mots de passe doit contenire entre 8 et 35 caractère ',
      );
    }
    const isMatched = bcrypt.compareSync(password, user.password);
    if (isMatched) {
      throw new ForbiddenException('this is the old password');
    }

    const ashPassword: string = bcrypt.hashSync(password, 10);
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: ashPassword,
      },
    });
  }

  async forgetPasswordChange(dto: forgetPassChange) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: dto.id,
      },
    });

    if (!user) {
      throw new ForbiddenException('no user has this id');
    }
    const passwordResetToken = await this.prisma.passwordResetToken.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!passwordResetToken) {
      throw new ForbiddenException("the user hasn't passwordResetToken");
    }

    if (dto.token !== passwordResetToken.token) {
      throw new ForbiddenException(' wrong token');
    }

    const tokenDuration =
      Date.now() - Date.parse(passwordResetToken.createdAt.toString());
    if (tokenDuration > 3600000) {
      await this.prisma.passwordResetToken.delete({
        where: { userId: user.id },
      });
      throw new ForbiddenException('your token is expired');
    }

    await this.changePassword(dto.password, user);

    await this.prisma.passwordResetToken.delete({
      where: { userId: user.id },
    });
    return { mess: 'password change' };
  }
}
