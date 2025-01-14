import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateServiceDto } from './dto/create-service.dto';
import { Decimal } from '@prisma/client/runtime/library';

const defaultInclude = {
  object: true,
} as const;

export const transformDecimal = (decimal: Decimal): number => {
  return decimal ? decimal.toNumber() : 0;
};

@Injectable()
export class ServiceDataService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateServiceDto) {
    const service = await this.prisma.service.create({
      data: { ...data, price: new Decimal(data.price) },
      include: defaultInclude,
    });

    return {
      ...service,
      price: transformDecimal(service.price),
    };
  }

  async find(params: {
    where?: Prisma.ServiceWhereInput;
    include?: Prisma.ServiceInclude;
    take?: number;
    skip?: number;
    orderBy?: Prisma.ServiceOrderByWithRelationInput;
  }) {
    const { where, include, take, skip, orderBy } = params;
    return this.prisma.service.findMany({
      where,
      include,
      take,
      skip,
      orderBy,
    });
  }

  async update(id: number, data: Prisma.ServiceUpdateInput) {
    return this.prisma.service.update({
      where: { id },
      data,
      include: defaultInclude,
    });
  }

  async delete(id: number) {
    return this.prisma.service.delete({
      where: { id },
      include: defaultInclude,
    });
  }
}
