import { IsNumber, Min, IsOptional, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrder } from 'src/common/enums/SortOrder';

export class ObjectPaginationDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  offset?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of results per page (default: 10, max: 100)',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'floor',
    description: 'Field to sort by (default: id)',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'id';

  @ApiPropertyOptional({
    example: SortOrder.ASC,
    enum: SortOrder,
    description: 'Sort order (asc or desc)',
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC;
}
