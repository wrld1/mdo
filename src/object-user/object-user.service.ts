import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ObjectUserDataService } from './object-user.data-service';

@Injectable()
export class ObjectUserService {
  constructor(private objectUserDataService: ObjectUserDataService) {}

  async create(objectId, userId) {
    return this.objectUserDataService.create(objectId, userId);
  }

  async findAll(objectId?: string, userId?: number) {
    return this.objectUserDataService.find({
      where: {
        ...(objectId && { objectId }),
        ...(userId && { userId }),
      },
      include: {
        user: true,
        object: true,
      },
    });
  }

  async findOne(id: number) {
    return this.objectUserDataService.find({
      where: { id },
      include: {
        user: true,
        object: true,
      },
    });
  }

  // async delete(id: string) {
  //   const objectUser = await this.objectUserDataService.find({
  //     where: { userId, objectId },
  //   });

  //   if (!objectUser) {
  //     return null;
  //   }

  //   return this.objectUserDataService.delete(objectId, userId);
  // }
}
