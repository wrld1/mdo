import { Module } from '@nestjs/common';
import { DwellingServiceController } from './dwelling-service.controller';
import { DwellingServiceService } from './dwelling-service.service';

@Module({
  controllers: [DwellingServiceController],
  providers: [DwellingServiceService, DwellingServiceDataService],
  exports: [DwellingServiceService, DwellingServiceDataService],
})
export class DwellingServiceModule {}
