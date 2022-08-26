import { Injectable } from '@nestjs/common';
import { CreateTestcrudDto } from './dto/create-testcrud.dto';
import { UpdateTestcrudDto } from './dto/update-testcrud.dto';

@Injectable()
export class TestcrudService {
  create(createTestcrudDto: CreateTestcrudDto) {
    return 'This action adds a new testcrud';
  }

  findAll() {
    return `This action returns all testcrud`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testcrud`;
  }

  update(id: number, updateTestcrudDto: UpdateTestcrudDto) {
    return `This action updates a #${id} testcrud`;
  }

  remove(id: number) {
    return `This action removes a #${id} testcrud`;
  }
}
