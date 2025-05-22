import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { DwellingServicePaymentStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateServicePaymentDto {
  @ApiProperty({
    example: 5,
    description: 'Month of the billing period (1-12)',
  })
  @IsInt()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  @Type(() => Number)
  month: number;

  @ApiProperty({
    example: 2025,
    description: 'Year of the billing period (e.g., 2025)',
  })
  @IsInt()
  @Min(2000)
  @Max(2100)
  @IsNotEmpty()
  @Type(() => Number)
  year: number;

  @ApiProperty({ example: '150.75', description: 'Amount due for the period' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @IsOptional()
  amount?: number;

  @ApiProperty({
    example: '1234.5',
    description: 'Counter reading (if applicable)',
  })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  @IsNotEmpty()
  counter: number;

  @ApiProperty({
    enum: DwellingServicePaymentStatus,
    example: DwellingServicePaymentStatus.PENDING,
    default: DwellingServicePaymentStatus.PENDING,
  })
  @IsEnum(DwellingServicePaymentStatus)
  @IsOptional()
  status?: DwellingServicePaymentStatus = DwellingServicePaymentStatus.PENDING;
}
