import { IsString } from "class-validator";

export class CreateBookmarkDto {
  @IsString()
  url: string;
}
