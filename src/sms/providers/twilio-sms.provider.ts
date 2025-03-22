import { Injectable, Inject } from '@nestjs/common';
import { AbstractSmsService } from '../sms.service.abstract';
import { TWILIO_CLIENT } from '../../providers/twilio/twilio.provider';

@Injectable()
export class TwilioSmsProvider extends AbstractSmsService {
  constructor(@Inject(TWILIO_CLIENT) private readonly twilioClient) {
    super();
  }

  async sendSms(phoneNumber: string, message: string): Promise<any> {
    return this.twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    return /^\+[1-9]\d{1,14}$/.test(phoneNumber);
  }
}
