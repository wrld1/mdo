import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { AuthModule } from 'src/auth/auth.module';
import { CompaniesModule } from 'src/companies/companies.module';
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
    ClsModule.forRoot({
      middleware: {
        mount: true,
        setup: (cls, req) => {
          cls.set('userId', req.headers['x-user-id']);
        },
      },
    }),
    AuthModule,
    UsersModule,
    CompaniesModule,
    UserCompanyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
