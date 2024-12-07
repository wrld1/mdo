import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateDwellingDto } from './dto/create-dwelling.dto';
import { DwellingDataService } from './dwelling.data-service';
import { Dwelling } from 'src/common/interfaces/dwelling';
import { UpdateDwellingDto } from './dto/update-dwelling.dto';
import { FindDwellingsDto } from './dto/find-dwellings.dto';

@Injectable()
export class DwellingService {
  constructor(
    private prisma: PrismaService,
    private dwellingDataService: DwellingDataService,
  ) {}

  async create(data: CreateDwellingDto): Promise<Dwelling> {
    return this.dwellingDataService.create(data);
  }

  async findAll(params: FindDwellingsDto) {
    const { objectId, floor, entrance } = params;
    return this.dwellingDataService.find({
      where: { objectId, floor, entrance },
      many: true,
    });
  }

  async findOne(id: number) {
    const dwelling = await this.dwellingDataService.find({
      where: { id },
      many: false,
    });

    if (!dwelling) {
      throw new NotFoundException(`Квартиру не знайдено`);
    }

    return dwelling;
  }

  async update(id: number, data: UpdateDwellingDto) {
    try {
      return await this.dwellingDataService.update(id, data);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Квартиру не знайдено`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.dwellingDataService.remove(id);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Квартиру не знайдено`);
      }
      throw error;
    }
  }

  async addService(dwellingId: number, serviceId: number) {
    try {
      const dwelling = await this.findOne(dwellingId);
      if (!dwelling) {
        throw new NotFoundException(`Квартиру не знайдено`);
      }

      return await this.dwellingDataService.addService(dwellingId, serviceId);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Сервіс не знайдено`);
      }
      throw error;
    }
  }

  async removeService(dwellingId: number, serviceId: number) {
    try {
      const dwelling = await this.findOne(dwellingId);
      if (!dwelling) {
        throw new NotFoundException(`Квартиру не знайдено`);
      }

      return await this.dwellingDataService.removeService(
        dwellingId,
        serviceId,
      );
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Сервіс не знайдено`);
      }
      throw error;
    }
  }

  async getDwellingServices(dwellingId: number) {
    const dwelling = await this.findOne(dwellingId);
    if (!dwelling) {
      throw new NotFoundException(`Квартиру не знайдено`);
    }

    return this.dwellingDataService.getDwellingServices(dwellingId);
  }
}
