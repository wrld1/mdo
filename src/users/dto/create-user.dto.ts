import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { IUser } from 'src/common/interfaces/user';
import { passwordRegex } from 'src/common/utils/constants';

export class CreateUserDto implements IUser {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(passwordRegex, {
    message:
      'Password must have at least 1 Uppercase letter, 1 number and 1 special symbol',
  })
  password: string;
}
