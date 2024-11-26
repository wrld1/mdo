import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  async create(@Body() data: CreateServiceDto) {
    return this.serviceService.create(data);
  }

  @Get()
  async findAll(@Query('objectId') objectId?: string) {
    return this.serviceService.findAll(objectId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: UpdateServiceDto) {
    return this.serviceService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.serviceService.remove(id);
  }
}
