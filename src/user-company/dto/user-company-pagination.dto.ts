import { CompanyType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { CompanyTypeEnum } from 'src/common/enums/CompanyType';
import { IUserCompanyPagination } from 'src/common/interfaces/user-company';

export class PaginationDto implements IUserCompanyPagination {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1; // v dataservice вынести присваивание дефолтных значений

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10; // v dataservice вынести присваивание дефолтных значений

  @IsOptional()
  @IsEnum(CompanyType)
  type?: CompanyTypeEnum;
}
