import { Injectable } from '@nestjs/common';

export interface EmailOptions {
  to: string | string[];
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
  attachments?: any[];
}

@Injectable()
export abstract class AbstractEmailService {
  abstract sendEmail(options: EmailOptions): Promise<boolean>;
}
