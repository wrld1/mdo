import { DwellingService } from './../dwelling/dwelling.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DwellingServiceDataService } from './dwelling-service.data-service';
import { ServiceService } from 'src/service/service.service';
import { UpdateDwellingServiceDto } from './dto/update-dwelling-service.dto';
import { DwellingDataService } from 'src/dwelling/dwelling.data-service';
import { AclService } from 'src/acl/acl.service';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';

@Injectable()
export class DwellingServiceService {
  constructor(
    private dwellingServiceDataService: DwellingServiceDataService,
    private dwellingDataService: DwellingDataService,
    private serviceService: ServiceService,
    private alsProvider: AsyncLocalStorageProvider,
    private aclService: AclService,
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
      const dwelling = await this.dwellingDataService.find({
        where: { id: dwellingId },
      });

      if (!dwelling[0]) {
        throw new NotFoundException(`Квартиру не знайдено`);
      }

      const service = await this.serviceService.findOne(serviceId);

      if (!service) {
        throw new NotFoundException(`Сервіс не знайдено`);
      }

      const userId = this.alsProvider.get('uId');

      const canUpdate = await this.aclService.checkPermission(userId, [
        `/companyManagement/${dwelling[0].object.companyId}`,
        'admin',
      ]);

      if (!canUpdate) {
        throw new ForbiddenException(
          'User does not have the required permission',
        );
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
      const dwelling = await this.dwellingDataService.find({
        where: { id: dwellingId },
      });

      if (!dwelling[0]) {
        throw new NotFoundException(`Квартиру не знайдено`);
      }

      const service = await this.serviceService.findOne(serviceId);

      if (!service) {
        throw new NotFoundException(`Сервіс не знайдено`);
      }

      const userId = this.alsProvider.get('uId');

      const canRemove = await this.aclService.checkPermission(userId, [
        `/companyManagement/${dwelling[0].object.companyId}`,
        'admin',
      ]);

      if (!canRemove) {
        throw new ForbiddenException(
          'User does not have the required permission',
        );
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
