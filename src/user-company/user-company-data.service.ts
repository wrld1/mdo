import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from './dto/user-company-pagination.dto';

@Injectable()
export class UserCompanyDataService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCompanies(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        skip,
        take: limit,
      }),
      this.prisma.company.count(),
    ]);

    return {
      data: companies,
      total,
      page,
      limit,
    };
  }
}
