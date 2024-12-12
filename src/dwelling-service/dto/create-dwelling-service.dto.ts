import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { DwellingServiceStatus } from '@prisma/client';

export class CreateDwellingServiceDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  dwellingId: number;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  amount?: number;

  @ApiProperty({
    enum: DwellingServiceStatus,
    example: DwellingServiceStatus.ACTIVE,
  })
  @IsEnum(DwellingServiceStatus)
  @IsOptional()
  status?: DwellingServiceStatus;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  serviceId: number;
}
