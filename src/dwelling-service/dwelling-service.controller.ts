import {
  Controller,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Post,
  Delete,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { DwellingServiceService } from './dwelling-service.service';
import { CreateDwellingServiceDto } from './dto/create-dwelling-service.dto';
import { UpdateDwellingServiceDto } from './dto/update-dwelling-service.dto';
import { AddPaymentsRequestDto } from './dto/add-payment-request.dto';

@ApiTags('Dwelling-services')
@Controller('dwelling-services')
export class DwellingServiceController {
  constructor(
    private readonly dwellingServiceService: DwellingServiceService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all dwelling services' })
  @ApiResponse({
    status: 200,
    description: 'List of all dwelling services.',
  })
  async findAll() {
    return await this.dwellingServiceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific dwelling service by its ID' })
  @ApiResponse({
    status: 200,
    description: 'The dwelling service record.',
  })
  @ApiResponse({ status: 404, description: 'DwellingService not found' })
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.dwellingServiceService.findOneById(id);
  }

  @Get('dwelling/:dwellingId')
  @ApiOperation({ summary: 'Get all services for a specific dwelling' })
  @ApiResponse({
    status: 200,
    description: 'List of services for the specified dwelling.',
  })
  @ApiResponse({ status: 404, description: 'Dwelling not found' })
  async findAllByDwelling(
    @Param('dwellingId', ParseIntPipe) dwellingId: number,
  ) {
    return await this.dwellingServiceService.findAll({ where: { dwellingId } });
  }

  @Post('payments')
  @ApiOperation({
    summary:
      'Add one or more payment records. Accepts a single payment request or an array of requests.',
  })
  @ApiBody({
    description:
      'A single payment request object or an array of payment request objects. Each request identifies the DwellingService (by dwellingServiceId OR by dwellingId AND serviceId) and includes payment details (month, year, counter, status).',
    type: AddPaymentsRequestDto,
  })
  @ApiResponse({
    status: 201,
    description:
      'Payment records successfully processed. Returns a summary or list of processed payments.',
    example: () => ({
      message: String,
      processedCount: Number,
      results: Array,
    }),
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({
    status: 404,
    description: 'DwellingService, Dwelling, or Service not found.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User lacks permission.',
  })
  async addOrUpdatePayments(
    @Body() paymentRequests: AddPaymentsRequestDto | AddPaymentsRequestDto[],
  ) {
    return await this.dwellingServiceService.addPayments(paymentRequests);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update dwelling service status or amount' })
  @ApiResponse({
    status: 200,
    description: 'Dwelling service successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Dwelling service not found' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDwellingServiceDto: UpdateDwellingServiceDto,
  ) {
    return await this.dwellingServiceService.update(
      id,
      updateDwellingServiceDto,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Add a service to a dwelling' })
  @ApiResponse({
    status: 201,
    description: 'The service has been added to the dwelling.',
  })
  async addService(@Body() createDwellingServiceDto: CreateDwellingServiceDto) {
    return await this.dwellingServiceService.addService(
      createDwellingServiceDto.dwellingId,
      createDwellingServiceDto.serviceId,
    );
  }

  @Delete()
  @ApiOperation({ summary: 'Remove a service from a dwelling' })
  @ApiResponse({
    status: 200,
    description: 'The service has been removed from the dwelling.',
  })
  async removeService(@Body() body: { dwellingId: number; serviceId: number }) {
    return await this.dwellingServiceService.removeService(
      body.dwellingId,
      body.serviceId,
    );
  }
}
