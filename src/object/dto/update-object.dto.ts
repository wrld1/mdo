import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ObjectType } from '@prisma/client';

export class UpdateObjectDto {
  @IsString()
  @IsOptional()
  address?: string;

  @IsEnum(ObjectType)
  @IsOptional()
  type?: ObjectType;

  @IsString()
  @IsOptional()
  companyId?: string;
}
