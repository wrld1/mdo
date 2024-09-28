import { ForbiddenException, Injectable } from '@nestjs/common';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';
import { CompaniesDataService } from './companies-data.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AclService } from 'src/acl/acl.service';

@Injectable()
export class CompaniesService {
  constructor(
    private companiesDataService: CompaniesDataService,
    private aclService: AclService,
    private alsProvider: AsyncLocalStorageProvider,
  ) {}

  async create(data: CreateCompanyDto) {
    return await this.companiesDataService.create({
      ...data,
    });
  }

  async checkAcl(aclArr: string[]) {
    // acls = acls from db;
    // existingAcls = proverit est li v acl v db aclki is aclArr v parametrax, esli da to return true;
  }

  async update(id: string, data: UpdateCompanyDto) {
    const userId = this.alsProvider.get('uId');

    const canUpdate = await this.aclService.checkPermission(userId, [
      `/companyManagement/${id}`,
    ]);

    if (!canUpdate) {
      throw new ForbiddenException(
        'User does not have the required permission',
      );
    }

    return await this.companiesDataService.update(id, data);
  }

  async delete(id: string) {
    return this.companiesDataService.delete(id);
  }
}
