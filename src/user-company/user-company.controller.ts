import { Controller, Get, Query } from '@nestjs/common';
import { Role } from 'src/common/enums/Role';
import { Roles } from 'src/roles/roles.decorator';
import { PaginationDto } from './dto/user-company-pagination.dto';
import { UserCompanyService } from './user-company.service';

@Controller('user-company')
export class UserCompanyController {
  constructor(private readonly userCompanyService: UserCompanyService) {}

  @Get('/companies')
  @Roles(Role.Manager, Role.SuperAdmin)
  async getAllCompanies(@Query() paginationDto: PaginationDto) {
    return this.userCompanyService.getAllCompanies(paginationDto);
  }
}
