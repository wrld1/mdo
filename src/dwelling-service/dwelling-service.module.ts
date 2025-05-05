import { forwardRef, Module } from '@nestjs/common';
import { DwellingServiceController } from './dwelling-service.controller';
import { DwellingServiceService } from './dwelling-service.service';
import { DwellingServiceDataService } from './dwelling-service.data-service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ServiceModule } from 'src/service/service.module';
import { DwellingDataService } from 'src/dwelling/dwelling.data-service';
import { AsyncLocalStorageModule } from 'src/providers/als/als.module';
import { AclModule } from 'src/acl/acl.module';
import { ServicePaymentModule } from 'src/service-payment/service-payment.module';

@Module({
  controllers: [DwellingServiceController],
  providers: [
    DwellingServiceService,
    DwellingServiceDataService,
    DwellingDataService,
  ],
  exports: [DwellingServiceDataService, DwellingServiceService],
  imports: [
    PrismaModule,
    ServiceModule,
    AsyncLocalStorageModule,
    AclModule,
    ServicePaymentModule,
  ],
})
export class DwellingServiceModule {}
