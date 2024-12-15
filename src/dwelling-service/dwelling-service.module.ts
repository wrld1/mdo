import { forwardRef, Module } from '@nestjs/common';
import { DwellingServiceController } from './dwelling-service.controller';
import { DwellingServiceService } from './dwelling-service.service';
import { DwellingServiceDataService } from './dwelling-service.data-service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DwellingModule } from 'src/dwelling/dwelling.module';
import { ServiceModule } from 'src/service/service.module';
import { DwellingDataService } from 'src/dwelling/dwelling.data-service';
import { AsyncLocalStorageModule } from 'src/providers/als/als.module';
import { AclModule } from 'src/acl/acl.module';

@Module({
  controllers: [DwellingServiceController],
  providers: [
    DwellingServiceService,
    DwellingServiceDataService,
    DwellingDataService,
  ],
  exports: [DwellingServiceDataService, DwellingServiceService],

  imports: [PrismaModule, ServiceModule, AsyncLocalStorageModule, AclModule],
})
export class DwellingServiceModule {}
