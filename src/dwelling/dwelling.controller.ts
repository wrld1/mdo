import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { DwellingService } from './dwelling.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateDwellingDto } from './dto/create-dwelling.dto';
import { FindDwellingsDto } from './dto/find-dwellings.dto';
import { UpdateDwellingDto } from './dto/update-dwelling.dto';
import { PaginationParamsDto } from './dto/pagination-params.dto';

@ApiTags('Dwelling')
@Controller('dwelling')
export class DwellingController {
  constructor(private readonly dwellingService: DwellingService) {}

  // при создани двеллинга, я сразу создаю и двеллингСервис и ассайню туда сервисы которые уже есть в обьекте и активны
  @Post()
  @ApiOperation({ summary: 'Create a new dwelling' })
  @ApiResponse({ status: 201, description: 'The dwelling has been created.' })
  async create(@Body() data: CreateDwellingDto) {
    return await this.dwellingService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all dwellings' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated, sorted, and filtered list of dwellings.',
  })
  async findAll(
    @Query() query: FindDwellingsDto,
    @Query() paginationQuery: PaginationParamsDto,
  ) {
    return await this.dwellingService.findAll(query, paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a dwelling by id' })
  @ApiResponse({ status: 200, description: 'Return the dwelling.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.dwellingService.findOne(id);
  }

  //add acl check(admin & manager)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a dwelling' })
  @ApiResponse({ status: 200, description: 'The dwelling has been updated.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDwellingDto: UpdateDwellingDto,
  ) {
    if (updateDwellingDto.userId) {
      await this.dwellingService.assignUser(id, updateDwellingDto.userId);
    }

    return await this.dwellingService.update(id, updateDwellingDto);
  }

  //add acl check(admin & manager)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a dwelling' })
  @ApiResponse({ status: 200, description: 'The dwelling has been deleted.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.dwellingService.remove(id);
  }

  @Get(':id/services')
  @ApiOperation({ summary: 'Get all services for a dwelling' })
  @ApiResponse({
    status: 200,
    description: 'Return all services for the dwelling.',
  })
  async getDwellingServices(@Param('id', ParseIntPipe) id: number) {
    return await this.dwellingService.getDwellingServices(id);
  }
}