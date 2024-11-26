import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ObjectDataService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ObjectCreateInput) {
    return this.prisma.object.create({
      data,
      include: {
        company: true,
        users: true,
        services: true,
      },
    });
  }

  async find(params: {
    where?: Prisma.ObjectWhereInput;
    include?: Prisma.ObjectInclude;
    take?: number;
    skip?: number;
    orderBy?: Prisma.ObjectOrderByWithRelationInput;
  }) {
    const { where, include, take, skip, orderBy } = params;

    return this.prisma.object.findMany({
      where,
      include,
      take,
      skip,
      orderBy,
    });
  }

  async findFirst(params: {
    where: Prisma.ObjectWhereInput;
    include?: Prisma.ObjectInclude;
  }) {
    const { where, include } = params;
    return this.prisma.object.findFirst({
      where,
      include,
    });
  }

  async update(id, data: Prisma.ObjectUpdateInput) {
    return this.prisma.object.update({
      where: { id },
      data,
      include: {
        company: true,
        users: true,
        services: true,
      },
    });
  }

  async delete(where: Prisma.ObjectWhereUniqueInput) {
    return this.prisma.object.delete({
      where,
    });
  }
}
