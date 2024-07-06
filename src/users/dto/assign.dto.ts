import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Company, CompanyTypeEnum } from 'src/common/enums/CompanyType';
import { IAssign } from 'src/common/interfaces/assign';

export class Assign implements IAssign {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Company)
  @IsNotEmpty()
  type: CompanyTypeEnum;
}
