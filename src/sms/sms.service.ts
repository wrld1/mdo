// src/sms/sms.service.ts
import { Injectable } from '@nestjs/common';
import { SmsFactoryService } from './sms-factory.service';

@Injectable()
export class SmsService {
  constructor(private readonly smsFactoryService: SmsFactoryService) {}

  async sendSms(phoneNumber: string, message: string): Promise<any> {
    const provider = this.smsFactoryService.getProvider();

    if (!provider.validatePhoneNumber(phoneNumber)) {
      throw new Error('Invalid phone number format');
    }

    return provider.sendSms(phoneNumber, message);
  }
}
