import { IsEmail } from 'class-validator';

export class VerificationTokenPayload implements VerificationTokenPayload {
  @IsEmail()
  email: string;
}
