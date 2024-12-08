import { Injectable, NotFoundException } from '@nestjs/common';
import { DwellingServiceStatus } from '@prisma/client';
import { DwellingServiceDataService } from './dwelling-service.data-service';

@Injectable()
export class DwellingServiceService {
  constructor(private dwellingServiceDataService: DwellingServiceDataService) {}

  async updateStatus(id: number, status: DwellingServiceStatus) {
    try {
      const existingService =
        await this.dwellingServiceDataService.findById(id);
      if (!existingService) {
        throw new NotFoundException(`Не знайдено сервіс`);
      }

      return await this.dwellingServiceDataService.updateStatus(id, status);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Сталася помилка при оновленні статусу`);
    }
  }

  async updateAmount(id: number, amount: number) {
    try {
      const existingService =
        await this.dwellingServiceDataService.findById(id);

      if (!existingService) {
        throw new NotFoundException(`Не знайдено сервіс`);
      }

      return await this.dwellingServiceDataService.updateAmount(id, amount);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Сталася помилка при оновленні кількості`);
    }
  }
}
