import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCompanyDataService } from './user-company-data.service';
import { UserCompanyController } from './user-company.controller';
import { UserCompanyService } from './user-company.service';

@Module({
  controllers: [UserCompanyController],
  providers: [UserCompanyService, UserCompanyDataService, PrismaService],
  exports: [UserCompanyService, UserCompanyDataService],
})
export class UserCompanyModule {}
