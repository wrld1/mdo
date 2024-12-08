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

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update dwelling service status' })
  @ApiResponse({
    status: 200,
    description: 'Dwelling service status successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Dwelling service not found' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: DwellingServiceStatus,
  ) {
    return await this.dwellingServiceService.updateStatus(id, status);
  }

  @Patch(':id/amount')
  @ApiOperation({ summary: 'Update dwelling service amount' })
  @ApiResponse({
    status: 200,
    description: 'Dwelling service amount successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Dwelling service not found' })
  async updateAmount(
    @Param('id', ParseIntPipe) id: number,
    @Body('amount') amount: number,
  ) {
    return await this.dwellingServiceService.updateAmount(id, amount);
  }
}
