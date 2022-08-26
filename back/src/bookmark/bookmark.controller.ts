import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { GetCurrentUserLg, GetCurrentUserId, Public } from "../auth/decorator";

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Public()
  @Post()
  create(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @GetCurrentUserLg() userId: number,
  ) {
    console.log(userId);
    return this.bookmarkService.create(createBookmarkDto, userId);
  }

  @Get()
  findAll() {
    return this.bookmarkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookmarkService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarkService.update(+id, updateBookmarkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookmarkService.remove(+id);
  }
}
