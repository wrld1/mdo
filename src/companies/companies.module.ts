import { forwardRef, Module } from '@nestjs/common';
import { AclModule } from 'src/acl/acl.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AsyncLocalStorageModule } from 'src/providers/als/als.module';
import { CompaniesDataService } from './companies-data.service';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, CompaniesDataService],
  exports: [CompaniesService, CompaniesDataService],
  imports: [
    PrismaModule,
    AclModule,
    AsyncLocalStorageModule,
    forwardRef(() => UsersModule),
  ],
})
export class CompaniesModule {}
