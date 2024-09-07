import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Mail from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export default class EmailService {
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = Mail.createTransport({
      host: this.configService.get('EMAIL_SERVICE'),
      port: Number(this.configService.get('SMTP_PORT')),
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationLink = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;

    try {
      await this.transporter.sendMail({
        to: email,
        subject: 'Verify Your Email',
        html: `
          <h1>Email Verification</h1>
          <p>Please click the link below to verify your email:</p>
          <a href="${verificationLink}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `,
      });
    } catch (err) {
      throw new InternalServerErrorException('Не вдалося відправити email');
    }
  }

  public async sendResetPasswordLink(
    email: string,
    token: string,
  ): Promise<void> {
    const resetPasswordLink = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

    try {
      await this.transporter.sendMail({
        to: email,
        from: 'Osbb management system',
        subject: 'Відновити пароль на Osbb management system',
        text: 'Відновлення паролю',
        html: `<b>Схоже, що ви забули свій пароль, от посилання на його відновлення: 
        <a href="${resetPasswordLink}">Відновити пароль</a>
        </b>`,
      });
    } catch (err) {
      throw new InternalServerErrorException('Не вдалося відправити email');
    }
  }
}
