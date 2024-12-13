import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ObjectSearchParamsDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  objectSearch?: string | null;
}
