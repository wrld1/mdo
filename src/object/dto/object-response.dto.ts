import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { PaginationMetaResponseDto } from 'src/common/dto/pagination-meta.response.dto';
import { ObjectResponse } from 'src/common/interfaces/object';
import { CompanyResponseDto } from 'src/companies/dto/company-response.dto';
import { DwellingResponseDto } from 'src/dwelling/dto/dwelling-response.dto';

@Exclude()
export class ObjectResponseDto implements ObjectResponse {
  @Expose()
  @ApiProperty({ example: 'f3f2e850-b5d4-11ef-ac7e-96584d5248b2' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'вул. Київська, 123' })
  address: string;

  @Expose()
  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  updatedAt: Date;

  @Expose()
  @Type(() => CompanyResponseDto)
  @ApiProperty({
    type: () => [CompanyResponseDto],
    example: {
      id: 'comp-123',
      name: 'ЖЕК №1',
    },
  })
  company: CompanyResponseDto;

  @Expose()
  @Type(() => DwellingResponseDto)
  @ApiProperty({
    type: () => [DwellingResponseDto],
    example: [
      {
        id: 1,
        name: 'Квартира 101',
        number: '101',
      },
    ],
  })
  dwellings?: DwellingResponseDto[];
}
