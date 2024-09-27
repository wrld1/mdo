import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Company, CompanyTypeEnum } from 'src/common/enums/CompanyType';
import { AclPermission } from 'src/common/enums/Permission';
import { IUser } from 'src/common/interfaces/user';
import { passwordRegex } from 'src/common/utils/constants';

export class CreateUserDto implements IUser {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(passwordRegex, {
    message:
      'Пароль має містити щонайменше 1 Велику літеру, 1 цифру and 1 спеціальний символ',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  registrationType: 'company' | 'user';

  @IsString()
  @IsOptional()
  companyName: string;

  @IsEnum(Company)
  @IsOptional()
  companyType: CompanyTypeEnum;
}
