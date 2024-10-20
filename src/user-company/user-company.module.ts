import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AsyncLocalStorageModule } from 'src/providers/als/als.module';
import { UserCompanyDataService } from './user-company-data.service';
import { UserCompanyController } from './user-company.controller';
import { UserCompanyService } from './user-company.service';
import { UsersModule } from 'src/users/users.module';
import { isVerifiedGuard } from 'src/common/guards/isVerified.guard';
import { AclModule } from 'src/acl/acl.module';

@Module({
  controllers: [UserCompanyController],
  providers: [UserCompanyService, UserCompanyDataService, isVerifiedGuard],
  exports: [UserCompanyService, UserCompanyDataService],
  imports: [
    PrismaModule,
    AclModule,
    AsyncLocalStorageModule,
    forwardRef(() => UsersModule),
  ],
})
export class UserCompanyModule {}
