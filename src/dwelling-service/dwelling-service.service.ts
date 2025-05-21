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
import { AddPaymentsRequestDto } from './dto/add-payment-request.dto';

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

  async addPayment(dto: AddPaymentsRequestDto) {
    try {
      const specificInclude = {
        service: true,
        dwelling: { include: { object: { select: { companyId: true } } } },
      } as const;

      let targetDwellingService;

      if (dto.dwellingServiceId) {
        const ds = await this.dwellingServiceDataService.findById(
          dto.dwellingServiceId,
          specificInclude,
        );
        if (!ds) {
          throw new NotFoundException(
            `DwellingService with ID ${dto.dwellingServiceId} not found.`,
          );
        }
        targetDwellingService = ds;
      } else if (dto.dwellingId && dto.serviceId) {
        const dwellingServices = await this.dwellingServiceDataService.findAll({
          where: {
            dwellingId: dto.dwellingId,
            serviceId: dto.serviceId,
          },
          include: specificInclude,
        });
        if (!dwellingServices || dwellingServices.length === 0) {
          throw new NotFoundException(
            `DwellingService not found for Dwelling ID ${dto.dwellingId} and Service ID ${dto.serviceId}.`,
          );
        }
        targetDwellingService = dwellingServices[0];
      } else {
        throw new ForbiddenException(
          'Either dwellingServiceId or both dwellingId and serviceId must be provided.',
        );
      }

      if (!targetDwellingService.dwelling?.object?.companyId) {
        throw new NotFoundException(
          `Associated company not found for the DwellingService.`,
        );
      }
      const userId = this.alsProvider.get('uId');
      if (!userId) {
        throw new ForbiddenException('User ID not found in request context.');
      }
      const companyId = targetDwellingService.dwelling.object.companyId;
      const canAddPaymentPermission = await this.aclService.checkPermission(
        userId,
        [`/companyManagement/${companyId}`, 'admin'],
      );

      if (!canAddPaymentPermission) {
        throw new ForbiddenException(
          'User does not have permission to add payments for this service.',
        );
      }

      if (
        !targetDwellingService.service ||
        targetDwellingService.service.price === null ||
        targetDwellingService.service.price === undefined
      ) {
        throw new NotFoundException(
          `Service details or price not found for DwellingService ID ${targetDwellingService.id}. Cannot calculate payment amounts.`,
        );
      }
      const servicePrice = targetDwellingService.service.price;

      const paymentsToCreate: Prisma.DwellingServicePaymentCreateManyInput[] =
        dto.payments.map((paymentDto) => {
          const counterValue = paymentDto.counter;
          const calculatedAmountDecimal = servicePrice.mul(counterValue);

          return {
            dwellingServiceId: targetDwellingService.id,
            month: paymentDto.month,
            year: paymentDto.year,
            amount: calculatedAmountDecimal,
            counter: paymentDto.counter,
            status: paymentDto.status || DwellingServicePaymentStatus.PENDING,
          };
        });

      if (paymentsToCreate.length === 0) {
        return { message: 'No payments to create.', count: 0 };
      }

      const result =
        await this.servicePaymentDataService.createManyPayments(
          paymentsToCreate,
        );
      return {
        message: `${result.count} платеж(-ів) створено успішно.`,
        count: result.count,
      };
    } catch (error) {
      console.error(`Error in addPayment:`, error);
      throw error;
    }
  }
}
