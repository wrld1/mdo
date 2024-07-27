import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';
import { PaginationDto } from './dto/user-company-pagination.dto';
import { UserCompanyDataService } from './user-company-data.service';

@Injectable()
export class UserCompanyService {
  constructor(
    private userCompanyDataService: UserCompanyDataService,
    private alsProvider: AsyncLocalStorageProvider,
  ) {}

  async getAllCompanies(paginationDto: PaginationDto) {
    const { page, limit, type } = paginationDto;

    let where: Prisma.CompanyWhereInput = {};
    if (type) {
      where = { ...where, type };
    }

    // if (user.role === Role.SuperAdmin) {
    // change to permission check
    return this.userCompanyDataService.getAllCompanies(page, limit, where);
    // } else {
    //   where = {
    //     ...where,
    //     users: {
    //       some: { userId: user.id },
    //     },
    //   };
    //   return this.userCompanyDataService.getAllCompanies(page, limit, where);
    // }
  }
}
