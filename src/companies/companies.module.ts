import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CompaniesDataService } from './companies-data.service';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, CompaniesDataService],
  exports: [CompaniesService, CompaniesDataService],
  imports: [PrismaModule],
})
export class CompaniesModule {}
