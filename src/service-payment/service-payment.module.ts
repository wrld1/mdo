import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ServicePaymentDataService } from './service-payment.data-service';

@Module({
  imports: [PrismaModule],
  providers: [ServicePaymentDataService],
  exports: [ServicePaymentDataService],
})
export class ServicePaymentModule {}
