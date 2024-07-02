import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Company, CompanyType } from 'src/enums/CompanyType';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Company)
  type?: CompanyType;
}
