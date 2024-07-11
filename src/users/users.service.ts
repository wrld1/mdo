import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CompanyTypeEnum } from 'src/common/enums/CompanyType';
import { roundsOfHashing } from 'src/common/utils/shared/hashPassword';
import { UserCompanyDataService } from 'src/user-company/user-company-data.service';
import { CompaniesDataService } from './../companies/companies-data.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDataService } from './user-data.service';

@Injectable()
export class UsersService {
  constructor(
    private companiesDataService: CompaniesDataService,
    private userCompanyDataService: UserCompanyDataService,
    private userDataService: UserDataService,
  ) {}

  async create(data: CreateUserDto) {
    return await this.userDataService.create({
      ...data,
    });
  }

  async assignCompanyToUser(
    name: string,
    type: CompanyTypeEnum,
    userId: number,
  ) {
    const company = await this.companiesDataService.create({ name, type });

    await this.userCompanyDataService.create({ userId, companyId: company.id });
    return company;
  }

  async findAll() {
    return await this.userDataService.findAll();
  }

  async findOneById(id: number) {
    return await this.userDataService.findOneById(id);
  }

  async findOneByEmail(email: string) {
    return await this.userDataService.findOneByEmail(email);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return await this.userDataService.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userDataService.remove(id);
  }
}
