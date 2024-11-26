import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ObjectType } from '@prisma/client';

export class CreateObjectDto {
  @IsString()
  address: string;

  @IsEnum(ObjectType)
  type: ObjectType;

  @IsString()
  @IsOptional()
  companyId?: string;
}
