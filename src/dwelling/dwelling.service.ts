import { ObjectDataService } from './../object/object.data-service';
import { ServiceService } from 'src/service/service.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateDwellingDto } from './dto/create-dwelling.dto';
import { DwellingDataService } from './dwelling.data-service';
import { UpdateDwellingDto } from './dto/update-dwelling.dto';
import { FindDwellingsDto } from './dto/find-dwellings.dto';
import { UserDataService } from 'src/users/user-data.service';
import { DwellingServiceDataService } from 'src/dwelling-service/dwelling-service.data-service';
import { SortOrder } from 'src/common/enums/SortOrder';
import { PaginationParamsDto } from './dto/pagination-params.dto';
import { AclService } from 'src/acl/acl.service';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';

@Injectable()
export class DwellingService {
  constructor(
    private dwellingDataService: DwellingDataService,
    private userDataService: UserDataService,
    private dwellingServiceDataService: DwellingServiceDataService,
    private prisma: PrismaService,
    private aclService: AclService,
    private alsProvider: AsyncLocalStorageProvider,
    private serviceService: ServiceService,
    private objectDataService: ObjectDataService,
  ) {}

  async create(data: CreateDwellingDto) {
    const { objectId } = data;

    const objectServices = await this.serviceService.findAll(objectId);

    const dwelling = await this.dwellingDataService.create(data);

    const dwellingServices = objectServices.map((service) => ({
      dwellingId: dwelling.id,
      serviceId: service.id,
    }));

    await this.dwellingServiceDataService.createMany(dwellingServices);

    await this.objectDataService.update(objectId, {
      dwelling: { connect: { id: dwelling.id } },
    });

    return dwelling;
  }

  async findAll(
    params: FindDwellingsDto,
    paginationParams: PaginationParamsDto,
  ) {
    const { objectId, floor, entrance } = params;
    const {
      offset = 0,
      limit = 10,
      sortBy = 'id',
      sortOrder = SortOrder.ASC,
    } = paginationParams;

    const take = Math.min(limit, 100);
    const skip = offset;

    const orderBy: Prisma.DwellingOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [dwellings, total] = await this.prisma.$transaction(async (tx) => {
      const dwellings = await this.dwellingDataService.find(
        {
          where: { objectId, floor, entrance },
          skip,
          take,
          orderBy,
        },
        tx,
      );
      const total = await this.dwellingDataService.count(
        {
          where: { objectId, floor, entrance },
        },
        tx,
      );
      return [dwellings, total];
    });

    return {
      data: dwellings,
      meta: {
        total,
        size: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async findOne(id: number) {
    const dwelling = await this.dwellingDataService.find({
      where: { id },
    });

    if (!dwelling) {
      throw new NotFoundException(`Квартиру не знайдено`);
    }

    return dwelling[0];
  }

  async update(id: number, data: UpdateDwellingDto) {
    try {
      const userId = this.alsProvider.get('uId');

      // How to get companyId
      const canUpdate = await this.aclService.checkPermission(userId, [
        `/companyManagement/${id}`,
      ]);

      const dwelling = await this.findOne(id);

      if (!dwelling) {
        throw new NotFoundException(`Квартиру не знайдено`);
      }

      return await this.dwellingDataService.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const dwelling = await this.findOne(id);

      if (!dwelling) {
        throw new NotFoundException(`Квартиру не знайдено`);
      }

      return await this.dwellingDataService.remove(id);
    } catch (error) {
      throw error;
    }
  }

  async getDwellingServices(dwellingId: number) {
    const dwelling = await this.findOne(dwellingId);
    if (!dwelling) {
      throw new NotFoundException(`Квартиру не знайдено`);
    }

    return await this.dwellingServiceDataService.getDwellingServices(
      dwellingId,
    );
  }

  async assignUser(dwellingId: number, userId: number) {
    return await this.userDataService.update(userId, {
      dwelling: { connect: { id: dwellingId } },
    });
  }
}
