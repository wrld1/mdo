import { Module } from '@nestjs/common';
import { TwilioProvider, TWILIO_CLIENT } from './twilio.provider';

@Module({
  providers: [TwilioProvider],
  exports: [TwilioProvider],
})
export class TwilioModule {}
