import { Injectable } from '@nestjs/common';
import { CompanyType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ClsService } from 'nestjs-cls';
import { CompanyTypeEnum } from 'src/common/enums/CompanyType';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCompanyDataService } from 'src/user-company/user-company-data.service';
import { CompaniesDataService } from './../companies/companies-data.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDataService } from './user-data.service';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(
    private readonly cls: ClsService,
    private prisma: PrismaService,
    private userDataService: UserDataService,
    private companiesDataService: CompaniesDataService,
    private userCompanyDataService: UserCompanyDataService,
  ) {}

  async create(data: CreateUserDto) {
    return await this.userDataService.create({
      ...data,
    });
  }

  async assignCompanyToUser(
    name: string,
    type: CompanyTypeEnum,
    // userId: number,
  ) {
    const userId = this.cls.get('userId');
    const role = this.cls.get('role');

    console.log('User ID:', userId);
    console.log('Role:', role);
    const company = await this.companiesDataService.create({ name, type });

    switch (type) {
      case CompanyType.OSBB:
        await this.handleOSBBCompany(company.id, userId);
        break;
      case CompanyType.ManagingCompany:
        await this.handleManagingCompany(company.id, userId);
        break;
      case CompanyType.CottageTown:
        await this.handleCottageTownCompany(company.id, userId);
        break;
    }

    return company;
  }

  private async handleOSBBCompany(companyId: number, userId: number) {
    console.log('Assigning OSBB type company to user');
    await this.userCompanyDataService.create({ userId, companyId });
  }

  private async handleManagingCompany(companyId: number, userId: number) {
    console.log('Assigning ManagingCompany type company to user');
    await this.userCompanyDataService.create({ userId, companyId });
  }

  private async handleCottageTownCompany(companyId: number, userId: number) {
    console.log('Assigning CottageTown type company to user');
    await this.userCompanyDataService.create({ userId, companyId });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOneById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
