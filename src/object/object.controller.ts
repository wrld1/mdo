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
import { ObjectService } from './object.service';
import { CreateObjectDto } from './dto/create-object.dto';
import { AssignUserToObjectDto } from './dto/assign-user-to-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Object')
@Controller('object')
export class ObjectController {
  constructor(private readonly objectService: ObjectService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new object' })
  @ApiBody({ type: CreateObjectDto })
  @ApiResponse({ status: 201, description: 'Object successfully created' })
  async create(@Body() data: CreateObjectDto) {
    return this.objectService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all objects' })
  @ApiQuery({
    name: 'companyId',
    required: false,
    description: 'Filter objects by company ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of objects retrieved successfully',
  })
  async findAll(@Query('companyId') companyId?: string) {
    return this.objectService.findAll(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get object by ID' })
  @ApiParam({ name: 'id', description: 'Object ID' })
  @ApiResponse({ status: 200, description: 'Object retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Object not found' })
  async findOne(@Param('id') id: string) {
    return this.objectService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update object' })
  @ApiParam({ name: 'id', description: 'Object ID' })
  @ApiBody({ type: UpdateObjectDto })
  @ApiResponse({ status: 200, description: 'Object updated successfully' })
  async update(@Param('id') id: string, @Body() data: UpdateObjectDto) {
    return this.objectService.update(id, data);
  }

  // @Post(':id/users')
  // @ApiOperation({ summary: 'Assign user to object' })
  // @ApiParam({ name: 'id', description: 'Object ID' })
  // @ApiBody({ type: AssignUserToObjectDto })
  // @ApiResponse({
  //   status: 200,
  //   description: 'User successfully assigned to object',
  // })
  // async assignUser(
  //   @Param('id') id: string,
  //   @Body() data: AssignUserToObjectDto,
  // ) {
  //   return this.objectService.assignUser(id, data.userId);
  // }

  @Patch(':id/company')
  @ApiOperation({ summary: 'Assign company to object' })
  @ApiParam({ name: 'id', description: 'Object ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        companyId: { type: 'string', description: 'Company ID to assign' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Company successfully assigned to object',
  })
  async assignCompany(
    @Param('id') id: string,
    @Body() data: { companyId: string },
  ) {
    return this.objectService.assignCompany(id, data.companyId);
  }

  @Patch(':id/service')
  @ApiOperation({ summary: 'Assign service to object' })
  @ApiParam({ name: 'id', description: 'Object ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        serviceId: { type: 'number', description: 'Service ID to assign' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Service successfully assigned to object',
  })
  async assignService(
    @Param('id') id: string,
    @Body() data: { serviceId: number },
  ) {
    return this.objectService.assignService(id, data.serviceId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete object' })
  @ApiParam({ name: 'id', description: 'Object ID' })
  @ApiResponse({ status: 200, description: 'Object deleted successfully' })
  @ApiResponse({ status: 404, description: 'Object not found' })
  async remove(@Param('id') id: string) {
    return this.objectService.remove(id);
  }
}