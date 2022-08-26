import { PartialType } from '@nestjs/mapped-types';
import { CreateTestcrudDto } from './create-testcrud.dto';

export class UpdateTestcrudDto extends PartialType(CreateTestcrudDto) {}
