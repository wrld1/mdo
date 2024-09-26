import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
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
}
