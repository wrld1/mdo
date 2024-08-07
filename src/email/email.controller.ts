import { Body, Controller, Get, Inject, Post } from '@nestjs/common';

import EmailService from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('send-verification-link')
  async sendVerificationEmail(): Promise<void> {
    await this.emailService.sendVerificationEmail();
  }

  @Post('send-reset-password')
  async sendResetLink(@Body() emailData: { email: string }): Promise<void> {
    const { email } = emailData;
    await this.emailService.sendResetPasswordLink(email);
  }
}
