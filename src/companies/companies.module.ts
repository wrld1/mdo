import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompaniesDataService } from './companies-data.service';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, CompaniesDataService, PrismaService],
  exports: [CompaniesService, CompaniesDataService],
})
export class CompaniesModule {}
