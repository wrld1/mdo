import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AsyncLocalStorageModule } from 'src/providers/als/als.module';
import { UserCompanyDataService } from './user-company-data.service';
import { UserCompanyController } from './user-company.controller';
import { UserCompanyService } from './user-company.service';
import { UsersModule } from 'src/users/users.module';
import { isVerifiedGuard } from 'src/common/guards/isVerified.guard';

@Module({
  controllers: [UserCompanyController],
  providers: [UserCompanyService, UserCompanyDataService, isVerifiedGuard],
  exports: [UserCompanyService, UserCompanyDataService],
  imports: [
    PrismaModule,
    AsyncLocalStorageModule,
    forwardRef(() => UsersModule),
  ],
})
export class UserCompanyModule {}
