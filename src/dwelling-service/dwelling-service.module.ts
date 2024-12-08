import { Module } from '@nestjs/common';
import { DwellingServiceController } from './dwelling-service.controller';
import { DwellingServiceService } from './dwelling-service.service';
import { DwellingServiceDataService } from './dwelling-service.data-service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [DwellingServiceController],
  providers: [DwellingServiceService, DwellingServiceDataService],
  exports: [DwellingServiceService, DwellingServiceDataService],
  imports: [PrismaModule],
})
export class DwellingServiceModule {}
