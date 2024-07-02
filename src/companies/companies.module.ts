import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CompaniesDataService } from './companies-data.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, CompaniesDataService, PrismaService],
  exports: [CompaniesDataService, CompaniesService],
})
export class CompaniesModule {}
