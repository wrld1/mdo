import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';

@Injectable()
export class UserCompanyDataService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCompanies(
    page: number = 1,
    limit: number = 10,
    where?: Prisma.CompanyWhereInput,
  ) {
    const skip = (page - 1) * limit;

    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        skip,
        take: limit,
        where,
      }),
      this.prisma.company.count({ where }),
    ]);

    return {
      data: companies,
      total,
      page,
      limit,
    };
  }

  async create(createUserCompanyDto: CreateUserCompanyDto) {
    const { userId, companyId } = createUserCompanyDto;

    const userCompany = await this.prisma.userCompany.create({
      data: {
        userId,
        companyId,
      },
    });

    return userCompany;
  }
}
