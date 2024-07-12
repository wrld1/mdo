import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { RolesModule } from 'src/roles/roles.module';
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
    RolesModule,
    UsersModule,
    CompaniesModule,
    UserCompanyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
