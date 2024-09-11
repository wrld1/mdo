import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { MailType } from 'src/common/enums/MailType';
import { generateEmailHtml } from '../common/utils/generateEmailHtml';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export default class EmailService {
  private transporter: Transporter;

  constructor(private mailerService: MailerService) {
    // this.transporter = Mail.createTransport(
    //   {
    //     host: this.configService.get('EMAIL_HOST'),
    //     port: Number(this.configService.get('SMTP_PORT')),
    //     secure: false,
    //     auth: {
    //       user: this.configService.get('EMAIL_USER'),
    //       pass: this.configService.get('EMAIL_PASSWORD'),
    //     },
    //   },
    //   {
    //     from: {
    //       name: '"Osbb management system" <noreply@example.com>',
    //       address: 'Test App',
    //     },
    //   },
    // );
  }

  async sendMail(email: string, type: MailType, link: string) {
    const emailBody = generateEmailHtml(email, type, link);

    try {
      await this.mailerService.sendMail(emailBody);
    } catch (err) {
      throw new InternalServerErrorException('Не вдалося відправити email');
    }
  }
}
