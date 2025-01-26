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
import { UpdateObjectDto } from './dto/update-object.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { FindObjectsDto } from './dto/find-objects.dto';
import { ObjectSearchParamsDto } from './dto/object-search.dto';
import { PaginationParamsDto } from 'src/common/dto/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { ObjectResponseDto } from './dto/object-response.dto';
import { PagedObjectResponseDto } from './dto/paged-object-response.dto';

@ApiTags('Object')
@Controller('object')
export class ObjectController {
  constructor(private readonly objectService: ObjectService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new object' })
  @ApiBody({ type: CreateObjectDto })
  @ApiResponse({ status: 201, description: 'Object successfully created' })
  async create(@Body() data: CreateObjectDto) {
    const object = await this.objectService.create(data);
    return plainToInstance(ObjectResponseDto, object);
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
  async findAll(
    @Query() { companyId }: FindObjectsDto,
    @Query() paginationQuery: PaginationParamsDto,
    @Query() { objectSearch }: ObjectSearchParamsDto,
  ) {
    const objects = await this.objectService.findAll(
      paginationQuery,
      companyId,
      objectSearch,
    );
    return plainToInstance(PagedObjectResponseDto, {
      data: objects.data,
      meta: objects.meta,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get object by ID' })
  @ApiParam({ name: 'id', description: 'Object ID' })
  @ApiResponse({ status: 200, description: 'Object retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Object not found' })
  async findOne(@Param('id') id: string) {
    const object = await this.objectService.findOne(id);
    return plainToInstance(ObjectResponseDto, object);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update object' })
  @ApiParam({ name: 'id', description: 'Object ID' })
  @ApiBody({ type: UpdateObjectDto })
  @ApiResponse({ status: 200, description: 'Object updated successfully' })
  async update(@Param('id') id: string, @Body() data: UpdateObjectDto) {
    return await this.objectService.update(id, data);
  }

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
    return await this.objectService.assignCompany(id, data.companyId);
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
    return await this.objectService.assignService(id, data.serviceId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete object' })
  @ApiParam({ name: 'id', description: 'Object ID' })
  @ApiResponse({ status: 200, description: 'Object deleted successfully' })
  @ApiResponse({ status: 404, description: 'Object not found' })
  async remove(@Param('id') id: string) {
    return await this.objectService.remove(id);
  }
}
