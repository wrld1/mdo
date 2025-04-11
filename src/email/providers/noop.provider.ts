import { Injectable, Logger } from '@nestjs/common';
import { AbstractEmailService, EmailOptions } from '../email-service.abstract';

@Injectable()
export class NoOpEmailService extends AbstractEmailService {
  private readonly logger = new Logger(NoOpEmailService.name);

  async sendEmail(options: EmailOptions): Promise<boolean> {
    this.logger.log(`[NOOP] Would send email to: ${options.to}`);
    this.logger.log(`[NOOP] Subject: ${options.subject}`);
    return true;
  }
}
