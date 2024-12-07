import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { DwellingService } from './dwelling.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateDwellingDto } from './dto/create-dwelling.dto';
import { AddServiceDto } from './dto/add-service.dto';
import { FindDwellingsDto } from './dto/find-dwellings.dto';
import { UpdateDwellingDto } from './dto/update-dwelling.dto';
import { AssignUserDto } from './dto/assign-user.dto';

@ApiTags('Dwelling')
@Controller('dwelling')
export class DwellingController {
  constructor(private readonly dwellingService: DwellingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new dwelling' })
  @ApiResponse({ status: 201, description: 'The dwelling has been created.' })
  async create(@Body() data: CreateDwellingDto) {
    return this.dwellingService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all dwellings' })
  @ApiResponse({ status: 200, description: 'Return all dwellings.' })
  async findAll(@Query() query: FindDwellingsDto) {
    return this.dwellingService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a dwelling by id' })
  @ApiResponse({ status: 200, description: 'Return the dwelling.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dwellingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a dwelling' })
  @ApiResponse({ status: 200, description: 'The dwelling has been updated.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDwellingDto: UpdateDwellingDto,
  ) {
    return this.dwellingService.update(id, updateDwellingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a dwelling' })
  @ApiResponse({ status: 200, description: 'The dwelling has been deleted.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.dwellingService.remove(id);
  }

  @Get(':id/services')
  @ApiOperation({ summary: 'Get all services for a dwelling' })
  @ApiResponse({
    status: 200,
    description: 'Return all services for the dwelling.',
  })
  async getDwellingServices(@Param('id', ParseIntPipe) id: number) {
    return this.dwellingService.getDwellingServices(id);
  }

  @Post(':id/services')
  @ApiOperation({ summary: 'Add a service to a dwelling' })
  @ApiResponse({
    status: 201,
    description: 'The service has been added to the dwelling.',
  })
  async addService(
    @Param('id', ParseIntPipe) id: number,
    @Body() addServiceDto: AddServiceDto,
  ) {
    return this.dwellingService.addService(id, addServiceDto.serviceId);
  }

  @Post(':id/user')
  @ApiOperation({ summary: 'Assign a user to a dwelling' })
  @ApiResponse({
    status: 200,
    description: 'The user has been assigned to the dwelling.',
  })
  async assignUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignUserDto: AssignUserDto,
  ) {
    return this.dwellingService.assignUser(id, assignUserDto.userId);
  }

  @Delete(':id/services/:serviceId')
  @ApiOperation({ summary: 'Remove a service from a dwelling' })
  @ApiResponse({
    status: 200,
    description: 'The service has been removed from the dwelling.',
  })
  async removeService(
    @Param('id', ParseIntPipe) id: number,
    @Param('serviceId', ParseIntPipe) serviceId: number,
  ) {
    return this.dwellingService.removeService(id, serviceId);
  }
}
