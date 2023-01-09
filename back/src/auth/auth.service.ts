import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, LoginDto, TokenDto } from './dto';
import bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, Tokens } from './types';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: MailService,
  ) {}

  //inscription
  async signUp(dto: AuthDto) {
    if (dto.password.length < 8 || dto.password.length > 35) {
      throw new ForbiddenException(
        'le mots de passe doit contenire entre 8 et 20 caractère ',
      );
    }
    const password: string = bcrypt.hashSync(dto.password, 10);
    const mailToken = Math.floor(100000 + Math.random() * 900000);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          pseudo: dto.pseudo,
          password,
        },
      });
      await this.prisma.emailVerificationToken.create({
        data: {
          userId: user.id,
          token: mailToken,
        },
      });
      const tokens = await this.signToken(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);
      await this.mailService.sendUserConfirmation(user, mailToken);
      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('email already user ');
        }
      }
      throw error;
    }
  }

  async signIn(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException("User doesn't exist");
    }

    if (user.hashedRt !== null) {
      throw new ForbiddenException('User already connected');
    }
    const isMatched = bcrypt.compareSync(dto.password, user.password);
    if (!isMatched) {
      throw new ForbiddenException('wrong password');
    }
    const tokens = await this.signToken(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
    return true;
  }

  // ---connexion tokens part---

  async signToken(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
    };

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(jwtPayload, {
        expiresIn: '1d',
        secret: this.config.get<string>('AT_SECRET'),
      }),
      this.jwt.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');
    const rtMatches = bcrypt.compareSync(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.signToken(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  //update the refresh Token
  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = bcrypt.hashSync(rt, 10);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  // ---verify account tokens part---
  async reSendEmailVerifyAccount(userId: number) {
    const mailToken = Math.floor(100000 + Math.random() * 900000);
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    await this.prisma.emailVerificationToken.create({
      data: {
        userId: userId,
        token: mailToken,
      },
    });
    await this.mailService.sendUserConfirmation(user, mailToken);
  }

  async verifTokenAccount(dto: TokenDto): Promise<void> {
    //find the user in the DB
    const user = await this.prisma.user.findUnique({
      where: {
        id: dto.id,
      },
    });
    if (!user) {
      throw new ForbiddenException("user don't exist");
    }

    //find the token in the DB
    const token = await this.prisma.emailVerificationToken.findUnique({
      where: { userId: dto.id },
    });
    //check if the user as a token
    if (!token) {
      throw new ForbiddenException("user don't have token");
    }
    //check if the token is good
    if (token.token != dto.token) {
      throw new ForbiddenException('wrong token');
    }
    //check if the token in the DB is not expired
    const tokenDuration = Date.now() - Date.parse(token.createdAt.toString());
    if (tokenDuration > 3600000) {
      await this.prisma.emailVerificationToken.delete({
        where: { id: token.id },
      });
      throw new ForbiddenException('token expire');
    }
    //delete the token
    await this.prisma.emailVerificationToken.delete({
      where: { id: token.id },
    });

    //update the user in the DB
    await this.prisma.user.update({
      where: { id: dto.id },
      data: { is_verifed: true },
    });
  }
}
