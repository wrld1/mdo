import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderDataService } from './order-data.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationParamsDto } from 'src/common/dto/pagination.dto';
import { SortOrder } from 'src/common/enums/SortOrder';
import { Prisma } from '@prisma/client';
import { OrderType } from 'src/common/interfaces/order';

@Injectable()
export class OrderService {
  constructor(private orderDataService: OrderDataService) {}

  async create(createOrderDto: CreateOrderDto) {
    return await this.orderDataService.create(createOrderDto);
  }

  async findAll(
    paginationParams: PaginationParamsDto,
    companyId?: string,
    orderSearch?: string,
    orderType?: OrderType,
  ) {
    const {
      offset = 0,
      limit = 10,
      sortBy = 'id',
      sortOrder = SortOrder.ASC,
    } = paginationParams;

    const take = Math.min(limit, 100);
    const skip = offset;

    const orderBy = {
      [sortBy]: sortOrder,
    };

    const where: Prisma.OrderWhereInput = {
      ...(companyId ? { companyId } : {}),
      ...(orderType ? { type: orderType } : {}),
    };

    const include = {
      object: true,
      dwelling: true,
      user: true,
      company: true,
      responsibleUser: true,
    };

    if (orderSearch) {
      where.name = {
        equals: orderSearch,
        mode: 'insensitive',
      };
    }

    const [orders, total] = await Promise.all([
      this.orderDataService.find({
        where,
        include,
        take,
        skip,
        orderBy,
      }),
      this.orderDataService.count({
        where: {
          ...where,
        },
      }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        size: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.orderDataService.find({
      where: { id },
      include: {
        object: true,
        dwelling: true,
        user: true,
        company: true,
        responsibleUser: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Заявка не знайдена');
    }

    return order[0];
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    return await this.orderDataService.update(id, updateOrderDto);
  }

  async remove(id: string) {
    return await this.orderDataService.remove(id);
  }
}
