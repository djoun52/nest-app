import { Module } from '@nestjs/common';
import { TestcrudService } from './testcrud.service';
import { TestcrudController } from './testcrud.controller';

@Module({
  controllers: [TestcrudController],
  providers: [TestcrudService],
})
export class TestcrudModule {}
