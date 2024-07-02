import { Controller, Post, Delete, Body, Param, Patch } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(@Body() data: CreateCompanyDto) {
    return this.companiesService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: UpdateCompanyDto) {
    return this.companiesService.update(+id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.companiesService.delete(+id);
  }
}
