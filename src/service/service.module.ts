import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ServiceDataService } from './service.data-service';

@Module({
  imports: [PrismaModule],
  providers: [ServiceService, ServiceDataService],
  exports: [ServiceService],
  controllers: [ServiceController],
})
export class ServiceModule {}
