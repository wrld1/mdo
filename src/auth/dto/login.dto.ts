import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AuthType } from 'src/common/enums/AuthType';

export class LoginDto {
  @ApiProperty({
    description: 'Identifier (email or phone number)',
    example: 'user@example.com or +380501234567',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'P@ssw0rd!',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Authentication type',
    enum: AuthType,
    example: AuthType.EMAIL,
    required: true,
  })
  @IsEnum(AuthType)
  @IsNotEmpty()
  authType: AuthType;
}
