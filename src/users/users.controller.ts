import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/auth/decorators/public';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';
import { Assign } from './dto/assign.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  async getUsers(@Request() req) {
    return this.usersService.findAll();
  }

  @Post('/:id/assign')
  async userAssign(
    @Param('id', ParseIntPipe) id: number,
    @Body() { name, type }: Assign,
  ) {
    return this.usersService.userAssign(name, type, id);
  }
}
