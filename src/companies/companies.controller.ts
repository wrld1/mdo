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
    return this.companiesService.create(data);
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
    return this.companiesService.update(id, data);
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
    return this.companiesService.delete(id);
  }

  // @Delete('pending/cleanup')
  // @ApiOperation({
  //   summary: 'Delete all pending antispam companies',
  //   description: 'Deletes all companies flagged as pending antispam companies.',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Pending antispam companies successfully deleted.',
  // })
  // async deletePendingAntispamCompanies(@Param('id') id: string) {
  //   //companiya dolzhna bit v statuse inactive
  //   return await this.companiesService.deletePendingCompanies();
  // }
}
