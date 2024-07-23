import { Injectable } from '@nestjs/common';
import { CompaniesDataService } from './companies-data.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private companiesDataService: CompaniesDataService) {}

  async create(data: CreateCompanyDto) {
    return await this.companiesDataService.create({
      ...data,
    });
  }

  async update(id: string, data: UpdateCompanyDto) {
    return await this.companiesDataService.update(id, data);
  }

  async delete(id: string) {
    return this.companiesDataService.delete(id);
  }
}
