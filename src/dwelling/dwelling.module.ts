import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DwellingService } from './dwelling.service';
import { DwellingDataService } from './dwelling.data-service';
import { DwellingController } from './dwelling.controller';
import { DwellingServiceModule } from 'src/dwelling-service/dwelling-service.module';
import { UsersModule } from 'src/users/users.module';
import { AclModule } from 'src/acl/acl.module';
import { AsyncLocalStorageModule } from 'src/providers/als/als.module';
import { ServiceModule } from 'src/service/service.module';
import { ObjectModule } from 'src/object/object.module';
import { DwellingServiceDataService } from 'src/dwelling-service/dwelling-service.data-service';

@Module({
  providers: [DwellingService, DwellingDataService, DwellingServiceDataService],
  exports: [DwellingDataService, DwellingService],
  controllers: [DwellingController],
  imports: [
    PrismaModule,
    UsersModule,
    AclModule,
    AsyncLocalStorageModule,
    ServiceModule,
    ObjectModule,
  ],
})
export class DwellingModule {}
