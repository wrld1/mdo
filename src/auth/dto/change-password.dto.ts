import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

import { passwordRegex } from 'src/common/utils/constants';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'The old password of the user',
    example: 'OldP@ssw0rd',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    description:
      'The new password. Must be at least 8 characters long, contain at least one uppercase letter, one digit, and one special character.',
    example: 'NewP@ssw0rd!',
  })
  @IsString()
  @MinLength(8)
  @Matches(passwordRegex, {
    message:
      'Пароль має містити щонайменше 1 Велику літеру, 1 цифру and 1 спеціальний символ',
  })
  newPassword: string;
}
