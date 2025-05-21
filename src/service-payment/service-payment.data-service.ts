import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateServicePaymentDto } from './dto/create-service-payment.dto';

@Injectable()
export class ServicePaymentDataService {
  constructor(private prisma: PrismaService) {}

  async create(dwellingServiceId: number, data: CreateServicePaymentDto) {
    const createData = {
      month: data.month,
      year: data.year,
      amount: data.amount,
      counter: data.counter,
      status: data.status || 'PENDING',
      dwellingService: {
        connect: { id: dwellingServiceId },
      },
    };

    return this.prisma.dwellingServicePayment.create({
      data: createData,
    });
  }

  async createManyPayments(
    paymentsData: Prisma.DwellingServicePaymentCreateManyInput[],
  ) {
    return this.prisma.dwellingServicePayment.createMany({
      data: paymentsData,
      skipDuplicates: false,
    });
  }
}
