import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ObjectResponseDto } from './object-response.dto';
import { PaginationMetaResponseDto } from 'src/common/dto/pagination-meta.response.dto';

export class PagedObjectResponseDto {
  @Expose()
  @Type(() => ObjectResponseDto)
  @ApiProperty({ type: [ObjectResponseDto] })
  data: ObjectResponseDto[];

  @Expose()
  @Type(() => PaginationMetaResponseDto)
  @ApiProperty({ type: PaginationMetaResponseDto })
  meta: PaginationMetaResponseDto;
}
