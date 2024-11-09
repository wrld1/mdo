import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesDataService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCompanyDto) {
    return this.prisma.company.create({
      data,
    });
  }

  async update(id: string, data: UpdateCompanyDto) {
    return this.prisma.company.update({
      where: { id },
      data,
    });
  }

  async findOne(options: {
    where: Record<string, any>;
    include?: Record<string, boolean>;
  }) {
    return await this.prisma.company.findFirst({
      where: options.where,
      include: options.include,
    });
  }

  async delete(id: string, tx?: PrismaService) {
    if (tx) {
      return await tx.company.delete({
        where: { id },
      });
    }

    return await this.prisma.company.delete({
      where: { id },
    });

    //todo: Move acl and userCompany deletes in their data-service

    // return this.prisma.$transaction(async (tx) => {
    //   // вынести в свой датасервис
    //   await tx.acl.deleteMany({
    //     where: {
    //       OR: [
    //         { resource: `/companyManagement/${id}` },
    //         { resource: `/company/${id}` },
    //       ],
    //     },
    //   });

    //   // вынести в свой датасервис ( тоже прокидываю необязательный tx)
    //   await tx.userCompany.deleteMany({
    //     where: { companyId: id },
    //   });

    //   return await tx.company.delete({
    //     where: { id },
    //   });
    // });
  }

  async deletePendingCompanies() {
    const deletedCompanies = await this.prisma.company.deleteMany({
      where: {
        status: 'PENDING',
      },
    });
    return deletedCompanies.count;
  }
}
