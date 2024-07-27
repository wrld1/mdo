import { ForbiddenException, Injectable } from '@nestjs/common';
import { AclDataService } from 'src/acl/acl-data.service';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';
import { CompaniesDataService } from './companies-data.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    private companiesDataService: CompaniesDataService,
    private aclDataService: AclDataService,
    private alsProvider: AsyncLocalStorageProvider,
  ) {}

  async create(data: CreateCompanyDto) {
    return await this.companiesDataService.create({
      ...data,
    });
  }

  async update(id: string, data: UpdateCompanyDto) {
    const userId = this.alsProvider.get('uId');
    const isManager = await this.aclDataService.checkPermission(userId, id);
    if (isManager) {
      return await this.companiesDataService.update(id, data);
    } else {
      throw new ForbiddenException(
        'User does not have the required permission',
      );
    }
  }

  async delete(id: string) {
    return this.companiesDataService.delete(id);
  }
}
