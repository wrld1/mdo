import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { SortOrder } from 'src/common/enums/SortOrder';

export class FindDwellingsDto {
  @ApiPropertyOptional({ example: 'uuid-string' })
  @IsOptional()
  @IsString()
  objectId?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  floor?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  entrance?: number;
}