import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
} from '@nestjs/common';
import { CreateAclDto } from 'src/acl/dto/create-acl.dto';
import { Public } from 'src/common/decorators/public';
import { Assign } from './dto/assign.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Request() req) {
    return this.usersService.findAll();
  }

  @Post('/:id/assign')
  async userAssign(
    @Param('id', ParseIntPipe) id: number,
    @Body() { name, type }: Assign,
  ) {
    return this.usersService.assignCompanyToUser(name, type, id);
  }

  @Post('/acl')
  async createAcl(@Body() createAclDto: CreateAclDto) {
    return this.usersService.createAcl(createAclDto);
  }
}
