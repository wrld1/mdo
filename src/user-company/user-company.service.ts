import { Injectable, Query } from '@nestjs/common';

import { PaginationDto } from './dto/user-company-pagination.dto';
import { UserCompanyDataService } from './user-company-data.service';

@Injectable()
export class UserCompanyService {
  constructor(private userCompanyDataService: UserCompanyDataService) {}

  async getAllCompanies(@Query() paginationDto: PaginationDto) {
    return this.userCompanyDataService.getAllCompanies(paginationDto);
  }
}
