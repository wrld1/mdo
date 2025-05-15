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
import { DwellingServicePaymentStatus, Prisma } from '@prisma/client';
import { CreateServicePaymentDto } from 'src/service-payment/dto/create-service-payment.dto';
import { ServicePaymentDataService } from 'src/service-payment/service-payment.data-service';

@Injectable()
export class DwellingServiceService {
  constructor(
    private dwellingServiceDataService: DwellingServiceDataService,
    private dwellingDataService: DwellingDataService,
    private serviceService: ServiceService,
    private alsProvider: AsyncLocalStorageProvider,
    private aclService: AclService,
    private servicePaymentDataService: ServicePaymentDataService,
  ) {}

  async findAll(params?: {
    where?: Prisma.DwellingServiceWhereInput;
    orderBy?: Prisma.DwellingServiceOrderByWithRelationInput;
    include?: Prisma.DwellingServiceInclude;
  }) {
    try {
      const data = await this.dwellingServiceDataService.findAll(params);

      return data.map((dwellingService) => {
        const priceAsNumber =
          dwellingService.service?.price?.toNumber() ?? null;

        const dwellingServiceRes = {
          ...dwellingService,

          service: dwellingService.service
            ? {
                ...dwellingService.service,
                price: priceAsNumber,
              }
            : null,
        };

        console.log(dwellingServiceRes, 'dwellingServiceRes');

        return dwellingServiceRes;
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: number) {
    try {
      const dwellingService =
        await this.dwellingServiceDataService.findById(id);

      if (!dwellingService) {
        throw new NotFoundException(`DwellingService with ID ${id} not found.`);
      }

      const priceAsNumber = dwellingService.service?.price?.toNumber() ?? null;
      const payments =
        dwellingService.payments?.map((payment) => ({
          ...payment,
          amount: payment.amount?.toNumber?.() ?? payment.amount ?? null,
          counter: payment.counter?.toNumber?.() ?? payment.counter ?? null,
        })) ?? [];

      return {
        ...dwellingService,
        payments,
        service: dwellingService.service
          ? {
              ...dwellingService.service,
              price: priceAsNumber,
            }
          : null,
      };
    } catch (error) {
      console.error(`Error fetching DwellingService with ID ${id}:`, error);
      throw error;
    }
  }

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

      const existingDwellingService =
        await this.dwellingServiceDataService.findAll({
          where: {
            dwellingId: dwellingId,
            serviceId: serviceId,
          },
        });

      if (existingDwellingService && existingDwellingService.length > 0) {
        throw new ForbiddenException(`Сервіс вже додано до цієї квартири.`);
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

      const dwellingService = await this.dwellingServiceDataService.addService(
        dwellingId,
        serviceId,
      );

      await this.dwellingDataService.connectService(dwellingId, serviceId);

      return dwellingService;
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

  async addPayment(
    dwellingServiceId: number,
    paymentDto: CreateServicePaymentDto,
  ) {
    try {
      const dwellingService =
        await this.dwellingServiceDataService.findById(dwellingServiceId);

      if (!dwellingService) {
        throw new NotFoundException(
          `DwellingService with ID ${dwellingServiceId} not found.`,
        );
      }

      if (
        !dwellingService.service ||
        dwellingService.service.price === null ||
        dwellingService.service.price === undefined
      ) {
        throw new NotFoundException(
          `Service details or price not found for DwellingService ID ${dwellingServiceId}. Cannot calculate payment amount.`,
        );
      }

      const dwelling = await this.dwellingDataService.find({
        where: { id: dwellingService.dwellingId },
      });

      if (
        !dwelling ||
        dwelling.length === 0 ||
        !dwelling[0].object?.companyId
      ) {
        throw new NotFoundException(
          `Associated dwelling or company not found for DwellingService ID ${dwellingServiceId}.`,
        );
      }

      const userId = this.alsProvider.get('uId');
      if (!userId) {
        throw new ForbiddenException('User ID not found in request context.');
      }

      const companyId = dwelling[0].object.companyId;
      const canAddPayment = await this.aclService.checkPermission(userId, [
        `/companyManagement/${companyId}`,
        'admin',
      ]);

      if (!canAddPayment) {
        throw new ForbiddenException(
          'User does not have permission to add payments for this service.',
        );
      }

      const servicePrice = dwellingService.service.price;
      const counterValue = paymentDto.counter;

      const calculatedAmountDecimal = servicePrice.mul(counterValue);

      const paymentDataForCreation: CreateServicePaymentDto = {
        ...paymentDto,
        amount: calculatedAmountDecimal.toNumber(),
        status: paymentDto.status || DwellingServicePaymentStatus.PENDING,
      };

      const newPayment = await this.servicePaymentDataService.create(
        dwellingServiceId,
        paymentDataForCreation,
      );

      return newPayment;
    } catch (error) {
      console.error(
        `Error adding payment for DwellingService ${dwellingServiceId}:`,
        error,
      );
      throw error;
    }
  }
}
