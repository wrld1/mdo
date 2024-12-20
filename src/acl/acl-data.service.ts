import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAclDto } from './dto/create-acl.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AclDataService {
  constructor(private prisma: PrismaService) {}

  async createAcl(data: CreateAclDto) {
    const acl = await this.prisma.acl.create({
      data,
    });

    return acl;
  }

  async checkPermission(userId: number, resources: string[]) {
    const acl = await this.prisma.acl.findFirst({
      where: {
        userId,
        resource: {
          in: resources,
        },
      },
    });

    return acl;
  }

  async deleteAclEntries(id: string, tx?: Prisma.TransactionClient) {
    (tx || this.prisma).acl.deleteMany({
      where: {
        OR: [
          { resource: `/companyManagement/${id}` },
          { resource: `/company/${id}` },
        ],
      },
    });
  }
}
