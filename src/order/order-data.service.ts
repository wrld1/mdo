import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Prisma } from '@prisma/client';
import { OrderUpdate } from 'src/common/interfaces/order';

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

  async find(params: {
    where?: Prisma.OrderWhereInput;
    include?: Prisma.OrderInclude;
    take?: number;
    skip?: number;
    orderBy?: Prisma.OrderOrderByWithRelationInput;
  }) {
    const { where, include, take, skip, orderBy } = params;

    return this.prisma.order.findMany({
      where,
      skip,
      take,
      orderBy,
      include,
    });
  }

  async count(params: { where: Prisma.OrderWhereInput }) {
    const { where } = params;
    return this.prisma.order.count({ where });
  }

  async update(id: string, updateOrderDto: OrderUpdate) {
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

  async remove(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
