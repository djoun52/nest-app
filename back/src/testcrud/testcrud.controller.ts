import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TestcrudService } from './testcrud.service';
import { CreateTestcrudDto } from './dto/create-testcrud.dto';
import { UpdateTestcrudDto } from './dto/update-testcrud.dto';

@Controller('testcrud')
export class TestcrudController {
  constructor(private readonly testcrudService: TestcrudService) {}

  @Post()
  create(@Body() createTestcrudDto: CreateTestcrudDto) {
    return this.testcrudService.create(createTestcrudDto);
  }

  @Get()
  findAll() {
    return this.testcrudService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testcrudService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestcrudDto: UpdateTestcrudDto,
  ) {
    return this.testcrudService.update(+id, updateTestcrudDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testcrudService.remove(+id);
  }
}
