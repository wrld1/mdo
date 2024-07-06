import { IsInt, IsNotEmpty } from 'class-validator';
import { IUserCompany } from 'src/common/interfaces/user-company';

export class CreateUserCompanyDto implements IUserCompany {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  companyId: number;
}
