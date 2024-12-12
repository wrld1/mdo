import { DwellingService } from './../dwelling/dwelling.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DwellingServiceDataService } from './dwelling-service.data-service';
import { ServiceService } from 'src/service/service.service';
import { UpdateDwellingServiceDto } from './dto/update-dwelling-service.dto';

@Injectable()
export class DwellingServiceService {
  constructor(
    private dwellingServiceDataService: DwellingServiceDataService,
    private dwellingService: DwellingService,
    private serviceService: ServiceService,
  ) {}

  async update(id: number, { status, amount }: UpdateDwellingServiceDto) {
    try {
      const existingService =
        await this.dwellingServiceDataService.findById(id);
      if (!existingService) {
        throw new NotFoundException(`Не знайдено`);
      }

      return await this.dwellingServiceDataService.update(id, {
        status,
        amount,
      });
    } catch (error) {
      throw error;
    }
  }

  async addService(dwellingId: number, serviceId: number) {
    try {
      const dwelling = await this.dwellingService.findOne(dwellingId);

      if (!dwelling) {
        throw new NotFoundException(`Квартиру не знайдено`);
      }

      const service = await this.serviceService.findOne(serviceId);

      if (!service) {
        throw new NotFoundException(`Сервіс не знайдено`);
      }

      return await this.dwellingServiceDataService.addService(
        dwellingId,
        serviceId,
      );
    } catch (error) {
      throw error;
    }
  }

  async removeService(dwellingId: number, serviceId: number) {
    try {
      const dwelling = await this.dwellingService.findOne(dwellingId);

      if (!dwelling) {
        throw new NotFoundException(`Квартиру не знайдено`);
      }

      const service = await this.serviceService.findOne(serviceId);

      if (!service) {
        throw new NotFoundException(`Сервіс не знайдено`);
      }

      return await this.dwellingServiceDataService.removeService(
        dwellingId,
        serviceId,
      );
    } catch (error) {
      throw error;
    }
  }
}
