import { AbstractEmailService } from './email-service.abstract';
import { NoOpEmailService } from './providers/noop.provider';
import { SendGridMailService } from './providers/sendgrid.provider';

export class MailServiceFactory {
  static createMailService(): AbstractEmailService {
    if (process.env.SENDGRID_API_KEY) {
      return new SendGridMailService();
    } else {
      return new NoOpEmailService();
    }
  }
}
