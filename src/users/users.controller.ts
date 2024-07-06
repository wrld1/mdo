import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public';
import { Assign } from './dto/assign.dto';
import { UsersService } from './users.service';

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
    return this.usersService.assignCompanyToUser(name, type);
  }
}
