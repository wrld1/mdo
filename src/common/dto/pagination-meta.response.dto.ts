import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class PaginationMetaResponseDto {
  @ApiProperty({ example: 100 })
  @Expose()
  total: number;

  @ApiProperty({ example: 10 })
  @Expose()
  size: number;

  @ApiProperty({ example: 10 })
  @Expose()
  totalPages: number;
}
