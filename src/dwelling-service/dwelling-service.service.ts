import { DwellingService } from './../dwelling/dwelling.service';
import {
  BadRequestException,
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
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DwellingServiceService {
  constructor(
    private dwellingServiceDataService: DwellingServiceDataService,
    private dwellingDataService: DwellingDataService,
    private serviceService: ServiceService,
    private alsProvider: AsyncLocalStorageProvider,
    private aclService: AclService,
    private servicePaymentDataService: ServicePaymentDataService,
    private prisma: PrismaService,
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

  async addPayments(dtos: AddPaymentsRequestDto | AddPaymentsRequestDto[]) {
    const requestsArray = Array.isArray(dtos) ? dtos : [dtos];

    if (requestsArray.length === 0) {
      throw new BadRequestException('Payment requests array cannot be empty.');
    }

    const results = [];
    let processedCount = 0;

    return this.prisma.$transaction(
      async (tx) => {
        const specificInclude = {
          service: true,
          dwelling: { include: { object: { select: { companyId: true } } } },
        } as const;

        for (const dto of requestsArray) {
          if (!dto.payment) {
            results.push({
              error: 'Missing payment details in a request.',
              request: dto,
            });
            continue;
          }

          let targetDwellingService;

          if (dto.dwellingServiceId) {
            const ds = await this.dwellingServiceDataService.findById(
              dto.dwellingServiceId,
              specificInclude,
            );
            if (!ds) {
              results.push({
                error: `DwellingService with ID ${dto.dwellingServiceId} not found.`,
                dwellingServiceId: dto.dwellingServiceId,
              });
              continue;
            }
            targetDwellingService = ds;
          } else if (dto.dwellingId && dto.serviceId) {
            const dwellingServices =
              await this.dwellingServiceDataService.findAll({
                where: {
                  dwellingId: dto.dwellingId,
                  serviceId: dto.serviceId,
                },
                include: specificInclude,
              });
            if (!dwellingServices || dwellingServices.length === 0) {
              results.push({
                error: `DwellingService not found for Dwelling ID ${dto.dwellingId} and Service ID ${dto.serviceId}.`,
                dwellingId: dto.dwellingId,
                serviceId: dto.serviceId,
              });
              continue;
            }
            targetDwellingService = dwellingServices[0];
          } else {
            results.push({
              error:
                'Either dwellingServiceId or both dwellingId and serviceId must be provided in a request.',
              request: dto,
            });
            continue;
          }

          if (!targetDwellingService.dwelling?.object?.companyId) {
            results.push({
              error: `Associated company not found for DwellingService ID ${targetDwellingService.id}.`,
              dwellingServiceId: targetDwellingService.id,
            });
            continue;
          }
          const userId = this.alsProvider.get('uId');
          if (!userId) {
            throw new ForbiddenException(
              'User ID not found in request context.',
            );
          }
          const companyId = targetDwellingService.dwelling.object.companyId;
          const canAddPaymentPermission = await this.aclService.checkPermission(
            userId,
            [`/companyManagement/${companyId}`, 'admin'],
          );

          if (!canAddPaymentPermission) {
            results.push({
              error: `User does not have permission for DwellingService ID ${targetDwellingService.id}.`,
              dwellingServiceId: targetDwellingService.id,
            });
            continue;
          }

          if (
            !targetDwellingService.service ||
            targetDwellingService.service.price === null ||
            targetDwellingService.service.price === undefined
          ) {
            results.push({
              error: `Service details or price not found for DwellingService ID ${targetDwellingService.id}.`,
              dwellingServiceId: targetDwellingService.id,
            });
            continue;
          }
          const servicePrice = targetDwellingService.service.price;
          const paymentDto = dto.payment;

          const counterValue = new Prisma.Decimal(paymentDto.counter);
          const calculatedAmountDecimal = servicePrice.mul(counterValue);

          const dataForUpsert = {
            amount: calculatedAmountDecimal,
            counter: counterValue,
            status: paymentDto.status || DwellingServicePaymentStatus.PENDING,
          };

          try {
            const upsertedPayment = await tx.dwellingServicePayment.upsert({
              where: {
                dwellingServiceId_month_year: {
                  dwellingServiceId: targetDwellingService.id,
                  month: paymentDto.month,
                  year: paymentDto.year,
                },
              },
              create: {
                dwellingServiceId: targetDwellingService.id,
                month: paymentDto.month,
                year: paymentDto.year,
                ...dataForUpsert,
              },
              update: dataForUpsert,
            });
            results.push({ success: true, payment: upsertedPayment });
            processedCount++;
          } catch (upsertError) {
            results.push({
              error: `Failed to upsert payment for DwellingService ID ${targetDwellingService.id}, Month: ${paymentDto.month}, Year: ${paymentDto.year}.`,
              details: upsertError.message,
              dwellingServiceId: targetDwellingService.id,
            });
          }
        }

        return {
          message: `${processedCount} із ${requestsArray.length} платеж(-ів) успішно оброблено.`,
          processedCount,
          totalRequests: requestsArray.length,
          results,
        };
      },
      {
        maxWait: 10000,
        timeout: 20000,
      },
    );
  }
}
