import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { PaginationDto } from './dto/user-company-pagination.dto';
import { UserCompanyService } from './user-company.service';
import { isVerifiedGuard } from 'src/common/guards/isVerified.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyType } from '@prisma/client';

@ApiTags('UserCompany')
@Controller('user-company')
export class UserCompanyController {
  constructor(private readonly userCompanyService: UserCompanyService) {}

  @UseGuards(isVerifiedGuard)
  @Get('/companies')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve a paginated list of companies' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit the number of companies per page',
    example: 10,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: CompanyType,
    description: 'Filter companies by their type',
  })
  @ApiResponse({
    status: 200,
    description: 'List of companies retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access (Bearer token required).',
  })
  @ApiResponse({
    status: 400,
    description: 'Companies not found',
  })
  async getCompanies(@Query() paginationDto: PaginationDto) {
    return await this.userCompanyService.getCompanies(paginationDto);
  }
}
