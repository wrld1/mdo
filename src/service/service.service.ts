import { Injectable } from '@nestjs/common';
import { ServiceDataService } from './service.data-service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(private serviceDataService: ServiceDataService) {}

  async create(data: CreateServiceDto) {
    return await this.serviceDataService.create(data);
  }

  async findAll(objectId?: string) {
    return await this.serviceDataService.find({
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
    return await this.serviceDataService.update(id, data);
  }

  async remove(id: number) {
    return await this.serviceDataService.delete(id);
  }
}
