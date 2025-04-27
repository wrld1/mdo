import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDwellingServiceDto } from './dto/update-dwelling-service.dto';

@Injectable()
export class DwellingServiceDataService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.dwellingService.findMany();
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
