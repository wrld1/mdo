import { Module } from '@nestjs/common';
import { AclModule } from 'src/acl/acl.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AsyncLocalStorageModule } from 'src/providers/als/als.module';
import { UserCompanyModule } from 'src/user-company/user-company.module';
import { UserDataService } from './user-data.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, UserDataService],
  exports: [UsersService, UserDataService],
  controllers: [UsersController],
  imports: [
    CompaniesModule,
    UserCompanyModule,
    PrismaModule,
    AsyncLocalStorageModule,
    AclModule,
  ],
})
export class UsersModule {}
