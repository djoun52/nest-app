import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, Tokens } from './types';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async signup(dto: AuthDto) {
    const password: string = bcrypt.hashSync(dto.password, 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          pseudo: dto.pseudo,
          password,
        },
      });
      const tokens = await this.signToken(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);
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

  async signin(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException("User doesn't exist");
    }
    const isMatched = bcrypt.compareSync(dto.password, user.password);
    if (!isMatched) {
      throw new ForbiddenException('wrong password');
    }
    const tokens = await this.signToken(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    await this.mailerService.sendMail({
      to: user.email, // list of receivers
      from: 'noreply@nestjs.com', // sender address
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcome to my site', // plaintext body
      html: '<b>welcome</b>', // HTML body content
    });

    return tokens;
  }

  async logout(userId: number): Promise<boolean> {
    //console.log(userId);
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

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    //console.log(userId);
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

  async signToken(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
    };

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(jwtPayload, {
        expiresIn: '15m',
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
}
