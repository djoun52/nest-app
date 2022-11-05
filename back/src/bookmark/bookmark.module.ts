import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { AuthService } from '../auth/auth.service';
import { AtStrategy, RtStrategy } from '../auth/strategys';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [JwtModule.register({}), MailModule],
  controllers: [BookmarkController],
  providers: [BookmarkService, AuthService, AtStrategy, RtStrategy],
})
export class BookmarkModule {}
