// src/providers/twilio/twilio.provider.ts
import { Provider } from '@nestjs/common';
import * as twilio from 'twilio';

export const TWILIO_CLIENT = 'TWILIO_CLIENT';

export const TwilioProvider: Provider = {
  provide: TWILIO_CLIENT,
  useFactory: () => {
    return twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  },
};
