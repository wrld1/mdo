import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Company, CompanyTypeEnum } from 'src/common/enums/CompanyType';
import { ICompany } from 'src/common/interfaces/company';

export class CreateCompanyDto implements ICompany {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Company)
  @IsNotEmpty()
  type: CompanyTypeEnum;
}
