import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ILogin } from '../../common/interfaces/auth';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto implements ILogin {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'P@ssw0rd!',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
