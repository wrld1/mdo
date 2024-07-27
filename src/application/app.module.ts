import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { EmailModule } from 'src/email/email.module';
import { EmailConfirmationModule } from 'src/emailConfirmation/emailConfirmation.module';
import { AsyncLocalStorageModule } from 'src/providers/als/als.module';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';
import { UserCompanyModule } from 'src/user-company/user-company.module';
import { UsersModule } from 'src/users/users.module';
import configuration from '../config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    AuthModule,
    EmailModule,
    EmailConfirmationModule,
    UsersModule,
    CompaniesModule,
    UserCompanyModule,
    AsyncLocalStorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
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
