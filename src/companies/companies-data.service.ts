import { Injectable } from '@nestjs/common';
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

  async delete(id: string) {
    return this.prisma.company.delete({
      where: { id },
    });
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
