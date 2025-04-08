import { IsString, IsOptional, IsNumber, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceDto {
  @ApiProperty({
    description: 'Назва послуги',
    example: 'Електроенергія',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Детальний опис послуги',
    example: 'Професійний ремонт та обслуговування',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Ціна послуги',
    example: 1500.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'URL логотипу послуги',
    example: 'https://example.com/logo.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({
    description: "Ідентифікатор пов'язаного об'єкта",
    example: 'f3f2e850-b5d4-11ef-ac7e-96584d5248b2',
    required: false,
  })
  @IsString()
  @IsOptional()
  objectId?: string;

  @ApiProperty({
    description: "Ідентифікатор пов'язаної квартири",
    example: '2',
    required: false,
  })
  @IsInt()
  @IsOptional()
  dwellingId?: string;
}
