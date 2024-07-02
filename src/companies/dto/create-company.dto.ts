import { IsString, IsNotEmpty, IsInt, IsEnum } from 'class-validator';
import { Company, CompanyType } from 'src/enums/CompanyType';
import { ICompany } from 'src/interfaces/company';

export class CreateCompanyDto implements ICompany {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Company)
  @IsNotEmpty()
  type: CompanyType;
}
