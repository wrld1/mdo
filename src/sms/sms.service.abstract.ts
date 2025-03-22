// src/sms/sms.service.abstract.ts
import { Injectable } from '@nestjs/common';
import { ISmsProvider } from 'src/common/interfaces/sms.provider';

@Injectable()
export abstract class AbstractSmsService implements ISmsProvider {
  abstract sendSms(phoneNumber: string, message: string): Promise<any>;
  abstract validatePhoneNumber(phoneNumber: string): boolean;
}
