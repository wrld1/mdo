import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import EmailService from 'src/email/email.service';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';
import { UsersService } from 'src/users/users.service';
import { VerificationTokenPayload } from './dto/VerificationTokenPayload.dto';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
    private readonly alsProvider: AsyncLocalStorageProvider,
  ) {}

  async confirmEmail(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (user.isVerified) {
      return;
    }
    await this.usersService.confirmEmail(email);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException('Bad confirmation token');
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async sendVerificationLink() {
    const userId = this.alsProvider.get('uId');
    const user = await this.usersService.findOneById(userId);
    if (user.isVerified) {
      throw new BadRequestException('Email already confirmed');
    }

    const email = user.email;

    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`,
    });

    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}?token=${token}`;

    const text = `Вітаємо на Найзручнішому сайті. Щоб підтвердити email перейдіть за цим посиланням: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Email confirmation',
      text,
    });
  }
}
