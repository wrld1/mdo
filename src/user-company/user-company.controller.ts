import { Controller, Get, Query } from '@nestjs/common';
import { PaginationDto } from './dto/user-company-pagination.dto';
import { UserCompanyService } from './user-company.service';

@Controller('user-company')
export class UserCompanyController {
  constructor(private readonly userCompanyService: UserCompanyService) {}

  @Get('/companies')
  async getAllCompanies(@Query() paginationDto: PaginationDto) {
    return this.userCompanyService.getAllCompanies(paginationDto);
  }
}
