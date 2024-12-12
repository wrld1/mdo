import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { DwellingServiceStatus } from '@prisma/client';

export class UpdateDwellingServiceDto {
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
}
