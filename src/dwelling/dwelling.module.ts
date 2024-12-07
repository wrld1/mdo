import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DwellingService } from './dwelling.service';
import { DwellingDataService } from './dwelling.data-service';
import { DwellingController } from './dwelling.controller';

@Module({
  providers: [DwellingService, DwellingDataService],
  exports: [DwellingService, DwellingDataService],
  controllers: [DwellingController],
  imports: [PrismaModule],
})
export class DwellingModule {}
