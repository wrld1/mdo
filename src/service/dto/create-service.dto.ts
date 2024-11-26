import { IsString, IsOptional } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  price: string;

  @IsString()
  logo: string;

  @IsString()
  @IsOptional()
  objectId?: string;
}
