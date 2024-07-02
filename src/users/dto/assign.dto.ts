import { IsString, IsNotEmpty, IsInt, IsEnum } from 'class-validator';
import { Company, CompanyType } from 'src/enums/CompanyType';
import { IAssign } from 'src/interfaces/assign';

export class Assign implements IAssign {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Company)
  @IsNotEmpty()
  type: CompanyType;
}
