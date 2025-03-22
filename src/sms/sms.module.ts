import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { TwilioSmsProvider } from './providers/twilio-sms.provider';
import { Service2SmsProvider } from './providers/service2-sms.provider';
import { SmsFactoryService } from './sms-factory.service';
import { TwilioModule } from 'src/providers/twilio/twilio.module';

@Module({
  imports: [TwilioModule],
  providers: [
    SmsService,
    SmsFactoryService,
    TwilioSmsProvider,
    Service2SmsProvider,
  ],
  exports: [SmsService],
})
export class SmsModule {}
