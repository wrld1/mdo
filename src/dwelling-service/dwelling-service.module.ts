import { forwardRef, Module } from '@nestjs/common';
import { DwellingServiceController } from './dwelling-service.controller';
import { DwellingServiceService } from './dwelling-service.service';
import { DwellingServiceDataService } from './dwelling-service.data-service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DwellingModule } from 'src/dwelling/dwelling.module';
import { ServiceModule } from 'src/service/service.module';

@Module({
  controllers: [DwellingServiceController],
  providers: [DwellingServiceService, DwellingServiceDataService],
  exports: [DwellingServiceService, DwellingServiceDataService],
  imports: [PrismaModule, forwardRef(() => DwellingModule), ServiceModule],
})
export class DwellingServiceModule {}
