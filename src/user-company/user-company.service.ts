import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';
import { PaginationDto } from './dto/user-company-pagination.dto';
import { UserCompanyDataService } from './user-company-data.service';
import { AclService } from 'src/acl/acl.service';

@Injectable()
export class UserCompanyService {
  constructor(
    private userCompanyDataService: UserCompanyDataService,
    private alsProvider: AsyncLocalStorageProvider,
    private aclService: AclService,
  ) {}

  async getCompanies(paginationDto: PaginationDto) {
    const { page, limit, type } = paginationDto;
    const userId = this.alsProvider.get('uId');

    const isAdmin = await this.aclService.checkPermission(userId, ['admin']);

    let where: Prisma.CompanyWhereInput = {};

    if (!isAdmin) {
      where.users = {
        some: { userId },
      };
    }

    if (type) {
      where = { ...where, type };
    }

    return this.userCompanyDataService.getAllCompanies(page, limit, where);
  }
}
