import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
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

  // async findOne(id: string) {
  //   return await this.companiesDataService.findOne({
  //     where: { id },
  //   });
  // }

  async delete(id: string) {
    const userId = this.alsProvider.get('uId');

    const company = await this.companiesDataService.findOne({
      where: { id },
    });

    if (!company) {
      throw new BadRequestException('Компанія не знайдена');
    }

    const canDelete = await this.aclService.checkPermission(userId, [`admin`]);

    if (!canDelete) {
      throw new ForbiddenException(
        'У користувача немає прав на видалення компанії',
      );
    }

    return this.companiesDataService.delete(id);
  }

  async deletePendingCompanies() {
    return await this.companiesDataService.deletePendingCompanies();
  }
}
