import { Module } from '@nestjs/common';
import { UserCompanyService } from './user-company.service';
import { UserCompanyController } from './user-company.controller';
import { UserCompanyDataService } from './user-company-data.service';

@Module({
  controllers: [UserCompanyController],
  providers: [UserCompanyService, UserCompanyDataService],
  exports: [UserCompanyService, UserCompanyDataService],
})
export class UserCompanyModule {}
