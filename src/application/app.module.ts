import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { EmailModule } from 'src/email/email.module';
import { AsyncLocalStorageModule } from 'src/providers/als/als.module';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';
import { UserCompanyModule } from 'src/user-company/user-company.module';
import { UsersModule } from 'src/users/users.module';
import configuration from '../config/configuration';
import { ObjectModule } from 'src/object/object.module';
import { ServiceModule } from 'src/service/service.module';
import { DwellingModule } from 'src/dwelling/dwelling.module';
import { DwellingServiceModule } from 'src/dwelling-service/dwelling-service.module';
import { OrderModule } from 'src/order/order.module';
import { WinstonModule } from 'nest-winston';
import { loggerOptions } from 'src/logger.config';
import { SmsModule } from 'src/sms/sms.module';
import { TwilioModule } from 'src/providers/twilio/twilio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    WinstonModule.forRoot(loggerOptions),
    AuthModule,
    EmailModule,
    UsersModule,
    CompaniesModule,
    UserCompanyModule,
    AsyncLocalStorageModule,
    ServiceModule,
    OrderModule,
    ObjectModule,
    DwellingModule,
    DwellingServiceModule,
    TwilioModule,
    SmsModule,
  ],
})
export class AppModule {
  constructor(private readonly alsProvider: AsyncLocalStorageProvider) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        this.alsProvider.run(new Map(), () => {
          next();
        });
      })
      .forRoutes('*');
  }
}
