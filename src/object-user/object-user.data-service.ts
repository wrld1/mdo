import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ObjectUserDataService {
  constructor(private prisma: PrismaService) {}

  async find(params: {
    where: Prisma.ObjectUserWhereInput;
    include?: Prisma.ObjectUserInclude;
  }) {
    const { where, include } = params;
    return this.prisma.objectUser.findFirst({
      where,
      include,
    });
  }

  async create(objectId: string, userId: number) {
    return this.prisma.objectUser.create({
      data: {
        object: { connect: { id: objectId } },
        user: { connect: { id: userId } },
      },
      include: {
        user: true,
        object: true,
      },
    });
  }

  //   async delete(objectId: string, userId: number) {
  //     return this.prisma.objectUser.delete({
  //       where: {
  //         userId_objectId: {
  //           userId,
  //           objectId,
  //         },
  //       },
  //     });
  //   }
}
