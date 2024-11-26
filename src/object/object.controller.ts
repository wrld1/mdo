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
import { ObjectService } from './object.service';
import { ObjectType } from '@prisma/client';
import { CreateObjectDto } from './dto/create-object.dto';
import { AssignUserToObjectDto } from './dto/assign-user-to-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';

@Controller('object')
export class ObjectController {
  constructor(private readonly objectService: ObjectService) {}

  @Post()
  async create(@Body() data: CreateObjectDto) {
    return this.objectService.create(data);
  }

  @Get()
  async findAll(@Query('companyId') companyId?: string) {
    return this.objectService.findAll(companyId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.objectService.findOne(id);
  }

  @Post(':id/users')
  async assignUser(
    @Param('id') id: string,
    @Body() data: AssignUserToObjectDto,
  ) {
    return this.objectService.assignUser(id, data.userId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateObjectDto) {
    return this.objectService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.objectService.remove(id);
  }
}
