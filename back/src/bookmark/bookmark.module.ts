import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { AuthService } from '../auth/auth.service';
import { AtStrategy, RtStrategy } from '../auth/strategys';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [BookmarkController],
  providers: [BookmarkService, AuthService, AtStrategy, RtStrategy],
})
export class BookmarkModule {}
