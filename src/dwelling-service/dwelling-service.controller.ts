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
import { CreateServicePaymentDto } from 'src/service-payment/dto/create-service-payment.dto';

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

  @Post(':dwellingServiceId/payments')
  @ApiOperation({ summary: 'Add a payment record for a dwelling service' })
  @ApiBody({ type: CreateServicePaymentDto })
  @ApiResponse({
    status: 201,
    description: 'Payment record successfully created.',
  })
  @ApiResponse({ status: 404, description: 'DwellingService not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User lacks permission',
  })
  async addPayment(
    @Param('dwellingServiceId', ParseIntPipe) dwellingServiceId: number,
    @Body() paymentDto: CreateServicePaymentDto,
  ) {
    return await this.dwellingServiceService.addPayment(
      dwellingServiceId,
      paymentDto,
    );
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
