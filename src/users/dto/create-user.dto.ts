import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { AuthType } from 'src/common/enums/AuthType';
import { IUser } from 'src/common/interfaces/user';
import { passwordRegex } from 'src/common/utils/constants';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';

export class CreateUserDto implements IUser {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+380501234567',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+380501234567',
  })
  @IsString()
  @IsOptional()
  authType: AuthType;

  @ApiProperty({
    description:
      'The password of the user. Must contain at least 1 uppercase letter, 1 digit, and 1 special character.',
    minLength: 8,
    example: 'P@ssword1',
  })
  @IsString()
  @MinLength(8)
  @Matches(passwordRegex, {
    message:
      'Пароль має містити щонайменше 1 Велику літеру, 1 цифру and 1 спеціальний символ',
  })
  password: string;

  @ApiProperty({
    description: 'Company information of the user',
    type: CreateCompanyDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCompanyDto)
  company?: CreateCompanyDto;
}
