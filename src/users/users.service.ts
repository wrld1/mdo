import { CompaniesDataService } from './../companies/companies-data.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDataService } from './user-data.service';
import { CompanyType } from 'src/enums/CompanyType';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private userDataService: UserDataService,
    private companiesDataService: CompaniesDataService,
  ) {}

  async create(data: CreateUserDto) {
    return await this.userDataService.create({
      ...data,
    });
  }

  async userAssign(name: string, type: CompanyType, userId: number) {
    console.log('name from user service', name);

    //switch chtobi rospoznavat type companii

    return this.companiesDataService.assignCompanyToUser(name, type, userId);
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
