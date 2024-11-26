import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceDataService } from './service.data-service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(private serviceDataService: ServiceDataService) {}

  async create(data: CreateServiceDto) {
    return this.serviceDataService.create(data);
  }

  async findAll(objectId?: string) {
    return this.serviceDataService.find({
      where: objectId ? { objectId } : undefined,
      include: { object: true },
    });
  }

  async findOne(id: number) {
    const services = await this.serviceDataService.find({
      where: { id },
      include: { object: true },
    });
    return services[0];
  }

  async update(id: number, data: UpdateServiceDto) {
    return this.serviceDataService.update(id, data);
  }

  async remove(id: number) {
    return this.serviceDataService.delete(id);
  }
}
