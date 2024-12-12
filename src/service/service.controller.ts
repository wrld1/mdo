import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  // когда я добавляю новый сервис, то я добавляю этот сервис для всех двеллингов которые у меня в этом обьекте
  @Post()
  @ApiOperation({ summary: 'Create a new service' })
  @ApiBody({ type: CreateServiceDto })
  @ApiResponse({ status: 201, description: 'Service successfully created' })
  async create(@Body() data: CreateServiceDto) {
    return await this.serviceService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  @ApiQuery({
    name: 'objectId',
    required: false,
    description: 'Filter services by object ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of services retrieved successfully',
  })
  async findAll(@Query('objectId') objectId?: string) {
    return await this.serviceService.findAll(objectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Service ID',
  })
  @ApiResponse({ status: 200, description: 'Service retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async findOne(@Param('id') id: number) {
    return await this.serviceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update service' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Service ID',
  })
  @ApiBody({ type: UpdateServiceDto })
  @ApiResponse({ status: 200, description: 'Service updated successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async update(@Param('id') id: number, @Body() data: UpdateServiceDto) {
    return await this.serviceService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete service' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Service ID',
  })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async remove(@Param('id') id: number) {
    return await this.serviceService.remove(id);
  }
}
