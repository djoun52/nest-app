import { Test, TestingModule } from '@nestjs/testing';
import { TestcrudController } from './testcrud.controller';
import { TestcrudService } from './testcrud.service';

describe('TestcrudController', () => {
  let controller: TestcrudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestcrudController],
      providers: [TestcrudService],
    }).compile();

    controller = module.get<TestcrudController>(TestcrudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
