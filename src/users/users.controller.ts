import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateAclDto } from 'src/acl/dto/create-acl.dto';
import { Public } from 'src/common/decorators/public';
import { Assign } from './dto/assign.dto';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { isVerifiedGuard } from 'src/common/guards/isVerified.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Request() req) {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findOneById(userId);
    return plainToInstance(UserResponseDto, user);
  }

  @UseGuards(isVerifiedGuard)
  @Post(':id/assign')
  async userAssign(
    @Param('id', ParseIntPipe) id: number,
    @Body() { name, type }: Assign,
  ) {
    return this.usersService.assignCompanyToUser(name, type, id);
  }

  // @Post('/acl')
  // async createAcl(@Body() createAclDto: CreateAclDto) {
  //   return this.usersService.createAcl(createAclDto);
  // }
}
