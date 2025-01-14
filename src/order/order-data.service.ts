import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderDataService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: createOrderDto,
      include: {
        object: true,
        dwelling: true,
        user: true,
        company: true,
        responsibleUser: true,
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        object: true,
        dwelling: true,
        user: true,
        company: true,
        responsibleUser: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        object: true,
        dwelling: true,
        user: true,
        company: true,
        responsibleUser: true,
      },
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        object: true,
        dwelling: true,
        user: true,
        company: true,
        responsibleUser: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
