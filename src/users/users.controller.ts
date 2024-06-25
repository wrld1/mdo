import { Controller, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/auth/decorators/public';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  async getUsers(@Request() req) {
    return this.usersService.findAll();
  }
}
