import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Company, CompanyType } from 'src/common/enums/CompanyType';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Company)
  type?: CompanyType;
}
