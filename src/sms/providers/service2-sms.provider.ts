// src/sms/providers/service2-sms.provider.ts
import { Injectable } from '@nestjs/common';
import { AbstractSmsService } from '../sms.service.abstract';

@Injectable()
export class Service2SmsProvider extends AbstractSmsService {
  async sendSms(phoneNumber: string, message: string): Promise<any> {
    console.log(`Sending SMS via Service2 to ${phoneNumber}: ${message}`);
    return { success: true };
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    return /^\+[1-9]\d{1,14}$/.test(phoneNumber);
  }
}
