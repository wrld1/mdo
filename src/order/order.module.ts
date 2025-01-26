import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AclModule } from 'src/acl/acl.module';
import { AsyncLocalStorageModule } from 'src/providers/als/als.module';
import { OrderDataService } from './order-data.service';

@Module({
  imports: [PrismaModule, AclModule, AsyncLocalStorageModule],
  controllers: [OrderController],
  providers: [OrderService, OrderDataService],
  exports: [OrderService],
})
export class OrderModule {}
