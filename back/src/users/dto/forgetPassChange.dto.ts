import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class forgetPassChange {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  token: string;
}
