import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ObjectUserService } from './object-user.service';

@Controller('object-user')
export class ObjectUserController {
  constructor(private readonly objectUserService: ObjectUserService) {}

  @Get()
  async findAll(
    @Query('objectId') objectId?: string,
    @Query('userId') userId?: number,
  ) {
    return this.objectUserService.findAll(objectId, userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.objectUserService.findOne(id);
  }

  // @Delete(':id')
  // async remove(@Param('id') id: number) {
  //   return this.objectUserService.delete(id);
  // }
}
