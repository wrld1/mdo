import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MailType } from 'src/common/enums/MailType';
import { MailerService } from '@nestjs-modules/mailer';
import { generateEmail } from './utils/generateEmail';
import { AbstractEmailService } from './email-service.abstract';

@Injectable()
export default class EmailService {
  constructor(
    @Inject('MAIL_PROVIDER') private mailService: AbstractEmailService,
    private mailerService: MailerService,
  ) {}

  async sendMail(email: string, type: MailType, link: string) {
    const emailBody = generateEmail(email, type, link);

    try {
      await this.mailerService.sendMail(emailBody);
    } catch (err) {
      throw new InternalServerErrorException('Не вдалося відправити email');
    }
  }
}
