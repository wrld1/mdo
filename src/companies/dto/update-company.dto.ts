import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Company, CompanyTypeEnum } from 'src/common/enums/CompanyType';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Company)
  type?: CompanyTypeEnum;
}
