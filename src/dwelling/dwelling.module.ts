import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DwellingService } from './dwelling.service';
import { DwellingDataService } from './dwelling.data-service';
import { DwellingController } from './dwelling.controller';
import { DwellingServiceModule } from 'src/dwelling-service/dwelling-service.module';
import { UsersModule } from 'src/users/users.module';
import { AclModule } from 'src/acl/acl.module';
import { AsyncLocalStorageModule } from 'src/providers/als/als.module';
import { ObjectModule } from 'src/object/object.module';
import { ServiceModule } from 'src/service/service.module';

@Module({
  providers: [DwellingService, DwellingDataService],
  exports: [DwellingService, DwellingDataService],
  controllers: [DwellingController],
  imports: [
    PrismaModule,
    DwellingServiceModule,
    UsersModule,
    AclModule,
    AsyncLocalStorageModule,
    ServiceModule,
  ],
})
export class DwellingModule {}
