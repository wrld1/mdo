import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { isVerifiedGuard } from 'src/common/guards/isVerified.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyResponseDto } from './dto/company-response.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @UseGuards(isVerifiedGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiBody({ type: CreateCompanyDto })
  @ApiResponse({
    status: 201,
    description: 'The company has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  async create(@Body() data: CreateCompanyDto) {
    const company = await this.companiesService.create(data);
    return plainToInstance(CompanyResponseDto, company);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing company' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the company to update',
  })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Company not found.' })
  async update(@Param('id') id: string, @Body() data: UpdateCompanyDto) {
    const company = await this.companiesService.update(id, data);
    return plainToInstance(CompanyResponseDto, company);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a company' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the company to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Company not found.' })
  async delete(@Param('id') id: string) {
    return await this.companiesService.delete(id);
  }
}
