import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

//import { AuthDto } from '../auth/dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: number) {
    const url = `http://localhost:3000/verif-email?id=${user.id}`;

    await this.mailerService.sendMail({
      to: user.email,
      from: 'test.rioux.dev@gmail.com', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.pseudo,
        token,
        url,
      },
    });
  }

  async sendForgetPasswordLink(user: User, token: string) {
    const url = `http://localhost:3000/reset-pasword?token=${token}&id=${user.id}`;
    await this.mailerService.sendMail({
      to: user.email,
      from: 'test.rioux.dev@gmail.com',
      subject: 'Reset Password Link',
      template: './ResetPasswordLink', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.pseudo,
        url,
      },
    });
  }
}
