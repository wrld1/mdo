import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DwellingServiceService } from './dwelling-service.service';
import { DwellingServiceStatus } from '@prisma/client';

@ApiTags('dwelling-services')
@Controller('dwelling-services')
export class DwellingServiceController {
  constructor(
    private readonly dwellingServiceService: DwellingServiceService,
  ) {}

  @Get('dwelling/:dwellingId')
  @ApiOperation({ summary: 'Find all services for a specific dwelling' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of dwelling services',
  })
  findByDwelling(@Param('dwellingId', ParseIntPipe) dwellingId: number) {
    return this.dwellingServiceService.findByDwelling(dwellingId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update dwelling service status' })
  @ApiResponse({
    status: 200,
    description: 'Dwelling service status successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Dwelling service not found' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: DwellingServiceStatus,
  ) {
    return this.dwellingServiceService.updateStatus(id, status);
  }
}
