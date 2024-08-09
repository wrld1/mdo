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
    const userId = this.alsProvider.get('uId');

    let where: Prisma.CompanyWhereInput = {
      users: {
        some: { userId },
      },
    };
    if (type) {
      where = { ...where, type };
    }

    return this.userCompanyDataService.getAllCompanies(page, limit, where);
  }
}
