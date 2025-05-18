import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDwellingServiceDto } from './dto/update-dwelling-service.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DwellingServiceDataService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number, include?: Prisma.DwellingServiceInclude) {
    return await this.prisma.dwellingService.findUnique({
      where: { id },
      include: include ?? {
        dwelling: {
          include: {
            object: true,
          },
        },
        service: true,
        payments: true,
      },
    });
  }

  async findAll(params?: {
    where?: Prisma.DwellingServiceWhereInput;
    orderBy?: Prisma.DwellingServiceOrderByWithRelationInput;
    include?: Prisma.DwellingServiceInclude;
  }) {
    const { where, orderBy, include } = params || {};
    return this.prisma.dwellingService.findMany({
      where,
      orderBy,
      include: include ?? {
        dwelling: true,
        service: true,
        payments: true,
      },
    });
  }

  async update(id: number, { status, amount }: UpdateDwellingServiceDto) {
    return await this.prisma.dwellingService.update({
      where: { id },
      data: { status },
    });
  }

  async createMany(
    dwellingServices: { dwellingId: number; serviceId: number }[],
  ) {
    return await this.prisma.dwellingService.createMany({
      data: dwellingServices.map((service) => ({
        ...service,
        status: 'ACTIVE',
      })),
    });
  }

  async addService(dwellingId: number, serviceId: number) {
    return this.prisma.dwellingService.create({
      data: {
        dwelling: { connect: { id: dwellingId } },
        service: { connect: { id: serviceId } },
        status: 'ACTIVE',
      },
      include: {
        dwelling: true,
        service: true,
      },
    });
  }

  async getDwellingServices(dwellingId: number) {
    return this.prisma.dwellingService.findMany({
      where: {
        dwellingId,
      },
      include: {
        dwelling: true,
        service: true,
      },
    });
  }

  async removeService(dwellingId: number, serviceId: number) {
    return this.prisma.dwellingService.deleteMany({
      where: {
        dwellingId,
        serviceId,
      },
    });
  }
}
