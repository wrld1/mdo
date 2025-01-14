import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOperation, ApiResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { OrderResponseDto } from './dto/order-response.dto';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly ordersService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);
    return plainToInstance(OrderResponseDto, order);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Return all orders' })
  async findAll() {
    const orders = await this.ordersService.findAll();
    return orders.map((order) => plainToInstance(OrderResponseDto, order));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Return order by id' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@Param('id') id: number) {
    const order = await this.ordersService.findOne(id);
    return plainToInstance(OrderResponseDto, order);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order by id' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Order successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async update(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const order = await this.ordersService.update(id, updateOrderDto);
    return plainToInstance(OrderResponseDto, order);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order by id' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order successfully deleted' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async remove(@Param('id') id: number) {
    return await this.ordersService.remove(id);
  }
}
