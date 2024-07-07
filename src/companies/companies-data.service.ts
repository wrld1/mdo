import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesDataService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCompanyDto) {
    return this.prisma.company.create({
      data,
    });
  }

  //   async assignCompanyToUser(
  //     name: string,
  //     type: CompanyTypeEnum,
  //     userId: number,
  //   ) {
  //     const company = await this.create({ name, type });
  //     await this.prisma.userCompany.create({
  //       //userCompany data service
  //       data: {
  //         userId,
  //         companyId: company.id,
  //       },
  //     });
  //     //userCompany service
  //     return company;
  //   }
}
