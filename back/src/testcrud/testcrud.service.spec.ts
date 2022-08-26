import { Test, TestingModule } from '@nestjs/testing';
import { TestcrudService } from './testcrud.service';

describe('TestcrudService', () => {
  let service: TestcrudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestcrudService],
    }).compile();

    service = module.get<TestcrudService>(TestcrudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
