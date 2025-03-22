import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { AuthType } from 'src/common/enums/AuthType';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'The email of the user',
    example: 'user@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'The password of the user (minimum 8 characters)',
    example: 'Password123!',
    required: false,
  })
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: 'The phone number of the user',
    example: '+380501234567',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'The phone number of the user',
    example: '+380501234567',
  })
  @IsString()
  @IsOptional()
  authType?: AuthType;

  @ApiPropertyOptional({
    description: 'Phone verification code for the user',
    example: '232432535',
  })
  @IsString()
  @IsOptional()
  phoneVerificationCode?: string;

  @ApiPropertyOptional({
    description: 'Phone verification code expiration time',
    example: '2024-03-22T15:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  phoneVerificationExpires?: Date;

  @ApiPropertyOptional({
    description: 'Indicates whether the user is verified',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @ApiPropertyOptional({
    description: 'The refresh token for the user',
    example: 'some-refresh-token',
    required: false,
  })
  @IsString()
  @IsOptional()
  refreshToken?: string;

  @ApiPropertyOptional({
    description: 'The dwelling connection object',
    required: false,
  })
  @IsOptional()
  dwelling?: {
    connect: {
      id: number;
    };
  };
}
