import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAclDto } from './dto/create-acl.dto';

@Injectable()
export class AclDataService {
  constructor(private prisma: PrismaService) {}

  async createAcl(input: CreateAclDto) {
    const { userId, resource, permission } = input;

    const acl = await this.prisma.acl.create({
      data: {
        userId,
        resource,
        permission,
      },
    });
    return acl;
  }

  async checkPermission(userId: number, companyId: string) {
    const possibleResources = [
      `/companyManagement/${companyId}`,
      `/company/${companyId}`,
    ];

    let isManager: boolean = false;

    const acl = await this.prisma.acl.findFirst({
      where: {
        userId,
        resource: {
          in: possibleResources,
        },
      },
    });

    if (!acl) {
      throw new NotFoundException('ACL not found for this user and resource');
    }

    if (acl.resource === `/companyManagement/${companyId}`) {
      isManager = true;
    } else if (acl.resource === `/company/${companyId}`) {
      isManager = false;
    } else {
      throw new ForbiddenException(
        'User does not have the required permission',
      );
    }
    return isManager;
  }
}
