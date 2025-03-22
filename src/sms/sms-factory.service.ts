import { Injectable } from '@nestjs/common';
import { TwilioSmsProvider } from './providers/twilio-sms.provider';
import { Service2SmsProvider } from './providers/service2-sms.provider';
import { AbstractSmsService } from './sms.service.abstract';

@Injectable()
export class SmsFactoryService {
  constructor(
    private readonly twilioSmsProvider: TwilioSmsProvider,
    private readonly service2SmsProvider: Service2SmsProvider,
  ) {}

  getProvider(): AbstractSmsService {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      return this.twilioSmsProvider;
    } else if (process.env.SERVICE2_API_KEY) {
      return this.service2SmsProvider;
    }

    return this.twilioSmsProvider;
  }
}
