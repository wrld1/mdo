import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserCompanyService } from './user-company.service';
import { PaginationDto } from './dto/user-company-pagination.dto';

@Controller('user-company')
export class UserCompanyController {
  constructor(private readonly userCompanyService: UserCompanyService) {}

  @Get('/companies')
  async getAllCompanies(@Query() paginationDto: PaginationDto) {
    return this.userCompanyService.getAllCompanies(paginationDto);
  }
}
