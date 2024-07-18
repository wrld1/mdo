import { Injectable } from '@nestjs/common';
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
}
