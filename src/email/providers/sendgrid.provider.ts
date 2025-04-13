import { Injectable, Logger } from '@nestjs/common';
import { AbstractEmailService, EmailOptions } from '../email-service.abstract';
// import * as SendGrid from '@sendgrid/mail';
// import { MailDataRequired } from '@sendgrid/mail';
// import { EmailOptions } from 'src/types/email';

@Injectable()
export class SendGridMailService extends AbstractEmailService {
  private readonly logger = new Logger(SendGridMailService.name);
  private readonly defaultFrom: string;

  constructor() {
    super();
    const apiKey = process.env.SENDGRID_API_KEY;

    // SendGrid.setApiKey(apiKey);

    this.defaultFrom = process.env.DEFAULT_SENDER;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // const msg: MailDataRequired = {
      //   to: options.to,
      //   from: options.from || this.defaultFrom,
      //   subject: options.subject,
      //   text: options.text,
      //   html: options.html,
      //   attachments: options.attachments,
      // };

      // if (options.templateId && options.dynamicTemplateData) {
      //   msg['templateId'] = options.templateId;
      //   msg['dynamicTemplateData'] = options.dynamicTemplateData;
      // }

      // await SendGrid.send(msg);
      // this.logger.log(
      //   `Email sent to ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`,
      // );
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      return false;
    }
  }
}
