import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Service } from 'src/common/interfaces/service';

export class CreateServiceDto implements Service {
  @ApiProperty({
    description: 'Назва послуги',
    example: 'Електроенергія',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Детальний опис послуги',
    example: 'Професійний ремонт та обслуговування',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Ціна послуги',
    example: 1500.0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @ApiProperty({
    description: 'URL логотипу послуги',
    example: 'https://example.com/logo.png',
  })
  @IsString()
  logo: string;

  @ApiProperty({
    description: "Ідентифікатор пов'язаного об'єкта",
    required: false,
    example: 'f3f2e850-b5d4-11ef-ac7e-96584d5248b2',
  })
  @IsString()
  @IsOptional()
  objectId?: string;
}
