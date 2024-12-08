import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DwellingService } from './dwelling.service';
import { DwellingDataService } from './dwelling.data-service';
import { DwellingController } from './dwelling.controller';
import { DwellingServiceModule } from 'src/dwelling-service/dwelling-service.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [DwellingService, DwellingDataService],
  exports: [DwellingService, DwellingDataService],
  controllers: [DwellingController],
  imports: [PrismaModule, DwellingServiceModule, UsersModule],
})
export class DwellingModule {}
