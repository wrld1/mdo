import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateObjectDto } from './dto/create-object.dto';
import { ObjectDataService } from './object.data-service';
import { UpdateObjectDto } from './dto/update-object.dto';
import { SortOrder } from 'src/common/enums/SortOrder';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationParamsDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ObjectService {
  constructor(
    private objectDataService: ObjectDataService,
    private prisma: PrismaService,
  ) {}

  async create(data: CreateObjectDto) {
    return await this.objectDataService.create(data);
  }

  async findAll(
    paginationParams: PaginationParamsDto,
    companyId?: string,
    objectSearch?: string,
  ) {
    const {
      offset = 0,
      limit = 10,
      sortBy = 'id',
      sortOrder = SortOrder.ASC,
    } = paginationParams;

    const take = Math.min(limit, 100);
    const skip = offset;

    const orderBy = {
      [sortBy]: sortOrder,
    };

    const where: Prisma.ObjectWhereInput = {
      ...(companyId ? { companyId } : {}),
    };

    if (objectSearch) {
      where.address = {
        contains: objectSearch,
        mode: 'insensitive',
      };
    }

    const [objects, total] = await Promise.all([
      this.objectDataService.find({
        where,
        take,
        skip,
        orderBy,
      }),
      this.objectDataService.count({
        where: { companyId },
      }),
    ]);

    return {
      data: objects,
      meta: {
        total,
        size: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async findOne(id: string) {
    const object = await this.objectDataService.find({
      where: { id },
      include: {
        company: true,
        services: true,
      },
    });

    if (!object) {
      throw new NotFoundException("Об'єкт не знайдено");
    }

    return object[0];
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

  async update(id: string, data: UpdateObjectDto) {
    return await this.objectDataService.update(id, data);
  }

  async remove(id: string) {
    return await this.objectDataService.delete({ id });
  }
}
