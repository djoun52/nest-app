import { IsNotEmpty, IsEmail } from 'class-validator';

export class forgetPassAsk {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
