import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AclDataService } from 'src/acl/acl-data.service';
import { CreateAclDto } from 'src/acl/dto/create-acl.dto';
import { CompanyTypeEnum } from 'src/common/enums/CompanyType';
import { AclPermission } from 'src/common/enums/Permission';
import { roundsOfHashing } from 'src/common/utils/shared/hashPassword';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';
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
    private alsProvider: AsyncLocalStorageProvider,
    private aclDataService: AclDataService,
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
    const hasPermission = await this.aclDataService.checkPermission({
      userId,
      resource: '/:id/assign',
      permission: AclPermission.WRITE,
    });

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to assign this resource.',
      );
    }

    const company = await this.companiesDataService.create({ name, type });

    await this.userCompanyDataService.create({ userId, companyId: company.id });
    return company;
  }

  async createAcl(input: CreateAclDto) {
    const { userId, resource, permission } = input;

    const acl = await this.aclDataService.createAcl({
      userId,
      resource,
      permission,
    });

    return acl;
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
