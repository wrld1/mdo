import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { PaginationDto } from './dto/user-company-pagination.dto';
import { UserCompanyService } from './user-company.service';
import { isVerifiedGuard } from 'src/common/guards/isVerified.guard';

@Controller('user-company')
export class UserCompanyController {
  constructor(private readonly userCompanyService: UserCompanyService) {}

  @UseGuards(isVerifiedGuard)
  @Get('/companies')
  async getAllCompanies(@Query() paginationDto: PaginationDto) {
    return this.userCompanyService.getAllCompanies(paginationDto);
  }
}
