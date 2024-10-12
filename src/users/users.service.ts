import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAclDto } from 'src/acl/dto/create-acl.dto';
import { CompanyTypeEnum } from 'src/common/enums/CompanyType';
import { hashPassword } from 'src/common/utils/shared/hashPassword';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';
import { UserCompanyDataService } from 'src/user-company/user-company-data.service';
import { CompaniesDataService } from './../companies/companies-data.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDataService } from './user-data.service';
import { AclService } from 'src/acl/acl.service';

@Injectable()
export class UsersService {
  constructor(
    private companiesDataService: CompaniesDataService,
    private userCompanyDataService: UserCompanyDataService,
    private userDataService: UserDataService,
    private alsProvider: AsyncLocalStorageProvider,
    private aclService: AclService,
  ) {}

  async create(data: CreateUserDto) {
    return await this.userDataService.create({
      ...data,
    });
  }

  async assignCompanyToUser(
    code: number,
    type: CompanyTypeEnum,
    userId: number,
  ) {
    const company = await this.companiesDataService.create({ code, type });

    await this.userCompanyDataService.create({ userId, companyId: company.id });
    return company;
  }

  async createAcl(input: CreateAclDto) {
    const { userId, resource, permission } = input;

    const acl = await this.aclService.createAcl({
      userId,
      resource,
      permission,
    });

    return acl;
  }

  async confirmEmail(email: string): Promise<void> {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.isVerified) {
      throw new BadRequestException('Email already confirmed');
    }
    const updateUserDto: UpdateUserDto = { isVerified: true };
    await this.update(user.id, updateUserDto);
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
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }

    return await this.userDataService.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userDataService.remove(id);
  }
}
