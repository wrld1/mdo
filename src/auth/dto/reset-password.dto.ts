import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';
import { passwordRegex } from 'src/common/utils/constants';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The token for resetting the password',
    example: 'your-reset-jwt-token',
  })
  @IsString()
  resetToken: string;

  @ApiProperty({
    description:
      'The new password. Must be at least 8 characters long, contain at least one uppercase letter, one digit, and one special character.',
    example: 'P@ssw0rd!1',
  })
  @IsString()
  @MinLength(8)
  @Matches(passwordRegex, {
    message:
      'Пароль має містити щонайменше 1 Велику літеру, 1 цифру and 1 спеціальний символ',
  })
  newPassword: string;
}
