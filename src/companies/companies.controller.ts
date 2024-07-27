import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private alsProvider: AsyncLocalStorageProvider,
  ) {}

  @Post()
  async create(@Body() data: CreateCompanyDto) {
    return this.companiesService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateCompanyDto) {
    return this.companiesService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.companiesService.delete(id);
  }

  @Get('/alsData')
  async testGetAlsData(@Request() req) {
    const allData = this.alsProvider.getStore();

    return {
      alsData: allData ? Object.fromEntries(allData) : null,
      message: allData ? 'ALS data retrieved' : 'ALS data is undefined',
    };
  }
}
