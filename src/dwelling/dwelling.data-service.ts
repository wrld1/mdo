import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Dwelling } from 'src/common/interfaces/dwelling';

import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateDwellingDto } from './dto/update-dwelling.dto';

@Injectable()
export class DwellingDataService {
  constructor(private prisma: PrismaService) {}

  async create(data: Dwelling): Promise<Dwelling> {
    return this.prisma.dwelling.create({
      data,
      include: {
        object: true,
        services: true,
        DwellingService: true,
        user: true,
      },
    });
  }

  async find(
    params: {
      where: Prisma.DwellingWhereInput;
      skip?: number;
      take?: number;
      orderBy?: Prisma.DwellingOrderByWithRelationInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const { where, skip, take, orderBy } = params;
    const include = {
      object: true,
      services: true,
      DwellingService: true,
      user: true,
    };

    return (tx || this.prisma).dwelling.findMany({
      where,
      skip,
      take,
      orderBy,
      include,
    });
  }

  async count(
    params: { where: Prisma.DwellingWhereInput },
    tx?: Prisma.TransactionClient,
  ) {
    const { where } = params;
    return (tx || this.prisma).dwelling.count({ where });
  }

  async update(id: number, data: UpdateDwellingDto) {
    return this.prisma.dwelling.update({
      where: { id },
      data,
      include: {
        object: true,
        services: true,
        DwellingService: true,
        user: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.dwelling.delete({
      where: { id },
    });
  }
}
