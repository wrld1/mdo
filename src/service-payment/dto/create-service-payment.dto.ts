import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { DwellingServicePaymentStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateServicePaymentDto {
  @ApiProperty({
    example: '2025-05-01T00:00:00.000Z',
    description: 'Start date of the billing period',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    example: '2025-05-31T23:59:59.999Z',
    description: 'End date of the billing period',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

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
