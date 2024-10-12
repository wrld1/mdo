import { ApiProperty } from '@nestjs/swagger';
import { CompanyType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { CompanyTypeEnum } from 'src/common/enums/CompanyType';
import { IUserCompanyPagination } from 'src/common/interfaces/user-company';

export class PaginationDto implements IUserCompanyPagination {
  @ApiProperty({
    description: 'The page number for pagination',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'The number of items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'The type of the company',
    enum: CompanyType,
    required: false,
  })
  @IsOptional()
  @IsEnum(CompanyType)
  type?: CompanyTypeEnum;
}
