import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import ogs from 'open-graph-scraper';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async create(createBookmarkDto: CreateBookmarkDto, userId: number) {
    console.log(userId);
    let bookmarkDescrip: string;
    let title: string;
    let link: string;
    let image: string;

    ogs(createBookmarkDto, (error, results, response) => {
      if (results.ogDescription !== undefined) {
        bookmarkDescrip = results.ogDescription;
      } else {
        bookmarkDescrip = '';
      }
      title = results.ogTitle;
      link = results.requestUrl;
      image = results.image;
    });
  }

  findAll() {
    return `This action returns all bookmark`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookmark`;
  }

  update(id: number, updateBookmarkDto: UpdateBookmarkDto) {
    return `This action updates a #${id} bookmark`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookmark`;
  }
}
