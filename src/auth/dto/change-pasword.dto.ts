import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

import { passwordRegex } from 'src/common/utils/constants';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @MinLength(8)
  @Matches(passwordRegex, {
    message:
      'Пароль має містити щонайменше 1 Велику літеру, 1 цифру and 1 спеціальний символ',
  })
  newPassword: string;
}
