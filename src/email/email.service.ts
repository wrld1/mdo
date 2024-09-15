import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailType } from 'src/common/enums/MailType';
import { MailerService } from '@nestjs-modules/mailer';
import { generateEmail } from './utils/generateEmail';

@Injectable()
export default class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(email: string, type: MailType, link: string) {
    const emailBody = generateEmail(email, type, link);

    try {
      await this.mailerService.sendMail(emailBody);
    } catch (err) {
      throw new InternalServerErrorException('Не вдалося відправити email');
    }
  }
}
