import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDwellingServiceDto } from './dto/update-dwelling-service.dto';

@Injectable()
export class DwellingServiceDataService {
  constructor(private prisma: PrismaService) {}

  async update(id: number, { status, amount }: UpdateDwellingServiceDto) {
    return await this.prisma.dwellingService.update({
      where: { id },
      data: { status, amount },
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

  async updateAmount(id: number, amount: number) {
    return await this.prisma.dwellingService.update({
      where: { id },
      data: { amount },
    });
  }

  async findById(id: number) {
    return await this.prisma.dwellingService.findUnique({
      where: { id },
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
