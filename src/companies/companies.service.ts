import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';
import { CompaniesDataService } from './companies-data.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AclService } from 'src/acl/acl.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCompanyDataService } from 'src/user-company/user-company-data.service';
import { AclDataService } from 'src/acl/acl-data.service';
import { Company } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(
    private companiesDataService: CompaniesDataService,
    private aclService: AclService,
    private alsProvider: AsyncLocalStorageProvider,
    private prisma: PrismaService,
    private userCompaniesDataService: UserCompanyDataService,
    private aclDataService: AclDataService,
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

  async findOne(id: string) {
    const company = await this.companiesDataService.findOne({
      where: { id },
      include: {
        objects: true,
        users: true,
        orders: true,
      },
    });

    if (!company) {
      throw new NotFoundException(`Компанію не знайдено`);
    }

    return company;
  }

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

    this.prisma.$transaction(async (tx) => {
      await this.aclDataService.deleteAclEntries(id, tx);
      await this.userCompaniesDataService.delete(id, tx);
      await this.companiesDataService.delete(id, tx);
    });
  }

  async deletePendingCompanies() {
    return await this.companiesDataService.deletePendingCompanies();
  }
}
