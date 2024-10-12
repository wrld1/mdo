import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class sendVerificationLinkDto {
  @ApiProperty({
    description: 'The email to send the verification link',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
