import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserCompanyDataService } from './user-company-data.service';
import { UserCompanyController } from './user-company.controller';
import { UserCompanyService } from './user-company.service';

@Module({
  controllers: [UserCompanyController],
  providers: [UserCompanyService, UserCompanyDataService],
  exports: [UserCompanyService, UserCompanyDataService],
  imports: [PrismaModule],
})
export class UserCompanyModule {}
