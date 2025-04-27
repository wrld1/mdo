import {
  Controller,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Post,
  Delete,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DwellingServiceService } from './dwelling-service.service';
import { CreateDwellingServiceDto } from './dto/create-dwelling-service.dto';
import { UpdateDwellingServiceDto } from './dto/update-dwelling-service.dto';

@ApiTags('Dwelling-services')
@Controller('dwelling-services')
export class DwellingServiceController {
  constructor(
    private readonly dwellingServiceService: DwellingServiceService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all dwelling services' })
  @ApiResponse({
    status: 200,
    description: 'List of all dwelling services.',
  })
  async findAll() {
    return await this.dwellingServiceService.findAll();
  }

  // @Get('dwelling/:dwellingId')
  // @ApiOperation({ summary: 'Get all services for a specific dwelling' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'List of services for the specified dwelling.',
  // })
  // @ApiResponse({ status: 404, description: 'Dwelling not found' })
  // async findAllByDwelling(
  //   @Param('dwellingId', ParseIntPipe) dwellingId: number,
  // ) {
  //   return await this.dwellingServiceService.findAll();
  // }

  @Patch(':id')
  @ApiOperation({ summary: 'Update dwelling service status or amount' })
  @ApiResponse({
    status: 200,
    description: 'Dwelling service successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Dwelling service not found' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDwellingServiceDto: UpdateDwellingServiceDto,
  ) {
    return await this.dwellingServiceService.update(
      id,
      updateDwellingServiceDto,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Add a service to a dwelling' })
  @ApiResponse({
    status: 201,
    description: 'The service has been added to the dwelling.',
  })
  async addService(@Body() createDwellingServiceDto: CreateDwellingServiceDto) {
    return await this.dwellingServiceService.addService(
      createDwellingServiceDto.dwellingId,
      createDwellingServiceDto.serviceId,
    );
  }

  @Delete()
  @ApiOperation({ summary: 'Remove a service from a dwelling' })
  @ApiResponse({
    status: 200,
    description: 'The service has been removed from the dwelling.',
  })
  async removeService(@Body() body: { dwellingId: number; serviceId: number }) {
    return await this.dwellingServiceService.removeService(
      body.dwellingId,
      body.serviceId,
    );
  }
}
