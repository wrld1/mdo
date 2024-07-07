import { Module } from '@nestjs/common';
import { CompaniesModule } from 'src/companies/companies.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCompanyModule } from 'src/user-company/user-company.module';
import { UserDataService } from './user-data.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, UserDataService, PrismaService],
  exports: [UsersService, UserDataService],
  controllers: [UsersController],
  imports: [CompaniesModule, UserCompanyModule],
})
export class UsersModule {}
