import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Dwelling } from 'src/common/interfaces/dwelling';

export class CreateDwellingDto implements Dwelling {
  @ApiProperty({ example: 101 })
  @IsInt()
  @IsNotEmpty()
  number: number;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  floor?: number;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  entrance?: number;

  @ApiProperty({ example: 'uuid-string' })
  @IsString()
  @IsNotEmpty()
  objectId: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  userId?: number;
}
