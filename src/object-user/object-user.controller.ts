import { Controller, Get, Param, Query } from '@nestjs/common';
import { ObjectUserService } from './object-user.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('ObjectUser')
@Controller('object-user')
export class ObjectUserController {
  constructor(private readonly objectUserService: ObjectUserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all object-user relationships' })
  @ApiQuery({
    name: 'objectId',
    required: false,
    description: 'Filter by object ID',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: 'number',
    description: 'Filter by user ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of object-user relationships retrieved successfully',
  })
  async findAll(
    @Query('objectId') objectId?: string,
    @Query('userId') userId?: number,
  ) {
    return this.objectUserService.findAll(objectId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get object-user relationship by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Object-user relationship ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Object-user relationship retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Object-user relationship not found',
  })
  async findOne(@Param('id') id: number) {
    return this.objectUserService.findOne(id);
  }
}
