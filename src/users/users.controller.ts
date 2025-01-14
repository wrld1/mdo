import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Assign } from './dto/assign.dto';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { isVerifiedGuard } from 'src/common/guards/isVerified.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
  })
  async getUsers() {
    const users = await this.usersService.findAll();
    return users.map((user) => plainToInstance(UserResponseDto, user));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async getUserById(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findOneById(userId);
    return plainToInstance(UserResponseDto, user);
  }

  @UseGuards(isVerifiedGuard)
  @Post(':id/assign')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign a company to a user' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to assign the company',
    type: Number,
  })
  @ApiBody({
    description: 'Details for company assignment',
    type: Assign,
  })
  @ApiResponse({
    status: 200,
    description: 'Company assigned to the user successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
  })
  async userAssign(
    @Param('id', ParseIntPipe) id: number,
    @Body() { code, type }: Assign,
  ) {
    return await this.usersService.assignCompanyToUser(code, type, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to update',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(@Param('id') id: number, @Body() data: UpdateUserDto) {
    const user = await this.usersService.update(id, data);
    return plainToInstance(UserResponseDto, user);
  }
}
