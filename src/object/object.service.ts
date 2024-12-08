import { Injectable } from '@nestjs/common';
import { CreateObjectDto } from './dto/create-object.dto';
import { ObjectDataService } from './object.data-service';
import { UpdateObjectDto } from './dto/update-object.dto';

@Injectable()
export class ObjectService {
  constructor(private objectDataService: ObjectDataService) {}

  async create(data: CreateObjectDto) {
    return await this.objectDataService.create(data);
  }

  async findAll(companyId?: string) {
    return this.objectDataService.find({
      where: companyId ? { companyId } : undefined,
      include: {
        company: true,
        services: true,
      },
      many: true,
    });
  }

  async findOne(id: string) {
    const object = await this.objectDataService.find({
      where: { id },
      include: {
        company: true,
        services: true,
      },
    });
    return await object;
  }

  async assignCompany(objectId: string, companyId: string) {
    return this.objectDataService.update(objectId, {
      company: { connect: { id: companyId } },
    });
  }

  async assignService(objectId: string, serviceId: number) {
    return this.objectDataService.update(objectId, {
      services: { connect: { id: serviceId } },
    });
  }

  async assignDwelling(objectId: string, dwellingId: number) {
    return this.objectDataService.update(objectId, {
      dwelling: { connect: { id: dwellingId } },
    });
  }

  async update(id: string, data: UpdateObjectDto) {
    return await this.objectDataService.update(id, data);
  }

  async remove(id: string) {
    return await this.objectDataService.delete({ id });
  }
}
