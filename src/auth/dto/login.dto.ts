import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ILogin } from '../../common/interfaces/auth';

export class LoginDto implements ILogin {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
