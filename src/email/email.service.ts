import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';
import { UsersService } from 'src/users/users.service';

@Injectable()
export default class EmailService {
  private nodemailerTransport: Mail;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly alsProvider: AsyncLocalStorageProvider,
    private readonly usersService: UsersService,
  ) {
    this.nodemailerTransport = createTransport({
      service: this.configService.get('EMAIL_SERVICE'),
      port: Number(this.configService.get('SMTP_PORT')),
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendVerificationEmail(): Promise<void> {
    const userId = this.alsProvider.get('uId');
    const token = this.jwtService.sign(
      { uId: userId },
      {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
        expiresIn: '24h',
      },
    );
    const verificationLink = `${this.configService.get('FRONTEND_URL')}/verify?token=${token}`;

    try {
      const { email } = await this.usersService.findOneById(userId);

      await this.nodemailerTransport.sendMail({
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
      console.error(err);
      return err;
    }
  }

  public async sendResetPasswordLink(email: string): Promise<void> {
    const resetPasswordLink = `${this.configService.get('FRONTEND_URL')}/reset-password`;

    try {
      const success = await this.nodemailerTransport.sendMail({
        to: email,
        from: 'Osbb management system',
        subject: 'Reset password on Osbb management system',
        text: 'Reset Password',
        html: `<b>Seems like you forgot your password, here is the link for the new one: 
        <a href="${resetPasswordLink}">here</a>
        </b>`,
      });

      return success;
    } catch (err) {
      console.error(err);
      return err;
    }
  }
}
