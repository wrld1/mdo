import { Injectable } from '@nestjs/common';
import { CreateObjectDto } from './dto/create-object.dto';
import { ObjectDataService } from './object.data-service';
import { UpdateObjectDto } from './dto/update-object.dto';
import { ObjectUserDataService } from 'src/object-user/object-user.data-service';

@Injectable()
export class ObjectService {
  constructor(
    private objectDataService: ObjectDataService,
    private objectUserDataService: ObjectUserDataService,
  ) {}

  async create(data: CreateObjectDto) {
    return this.objectDataService.create(data);
  }

  async findAll(companyId?: string) {
    return this.objectDataService.find({
      where: companyId ? { companyId } : undefined,
      include: {
        company: true,
        users: true,
        services: true,
      },
    });
  }

  async findOne(id: string) {
    const objects = await this.objectDataService.find({
      where: { id },
      include: {
        company: true,
        users: true,
        services: true,
      },
    });
    return objects[0];
  }

  // async assignUser(objectId: string, userId: number) {
  //   const existingAssignment = await this.objectUserDataService.find({
  //     where: {
  //       objectId,
  //       userId,
  //     },
  //     include: {
  //       user: true,
  //       object: true,
  //     },
  //   });

  //   if (existingAssignment) {
  //     return existingAssignment;
  //   }

  //   return this.objectUserDataService.create(objectId, userId);
  // }

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

  async update(id: string, data: UpdateObjectDto) {
    return this.objectDataService.update(id, data);
  }

  async remove(id: string) {
    return this.objectDataService.delete({ id });
  }
}
