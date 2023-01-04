import { IsNotEmpty, IsNumber } from 'class-validator';

export class TokenDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  token: number;
}
