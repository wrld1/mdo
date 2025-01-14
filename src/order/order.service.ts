import { Injectable } from '@nestjs/common';
import { OrderDataService } from './order-data.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private orderDataService: OrderDataService) {}

  async create(createOrderDto: CreateOrderDto) {
    return await this.orderDataService.create(createOrderDto);
  }

  async findAll() {
    return await this.orderDataService.findAll();
  }

  async findOne(id: number) {
    return await this.orderDataService.findOne(id);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return await this.orderDataService.update(id, updateOrderDto);
  }

  async remove(id: number) {
    return await this.orderDataService.remove(id);
  }
}
