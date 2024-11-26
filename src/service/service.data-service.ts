import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

const defaultInclude = {
  object: true,
} as const;

@Injectable()
export class ServiceDataService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ServiceCreateInput) {
    return this.prisma.service.create({
      data,
      include: defaultInclude,
    });
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
