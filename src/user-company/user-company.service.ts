import { Injectable } from '@nestjs/common';

import { PaginationDto } from './dto/user-company-pagination.dto';
import { UserCompanyDataService } from './user-company-data.service';

@Injectable()
export class UserCompanyService {
  constructor(private userCompanyDataService: UserCompanyDataService) {}

  async getAllCompanies(paginationDto: PaginationDto) {
    const { page, limit, type } = paginationDto;
    return this.userCompanyDataService.getAllCompanies(page, limit, type);
  }
}
