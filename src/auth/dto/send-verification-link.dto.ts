import { IsEmail, IsNotEmpty } from 'class-validator';

export class sendVerificationLinkDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
