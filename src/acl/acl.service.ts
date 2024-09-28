import { Injectable } from '@nestjs/common';
import { AclDataService } from 'src/acl/acl-data.service';
import { CreateAclDto } from './dto/create-acl.dto';

@Injectable()
export class AclService {
  constructor(private aclDataService: AclDataService) {}

  async createAcl(input: CreateAclDto) {
    return await this.aclDataService.createAcl(input);
  }

  async checkPermission(userId: number, resources: string[]) {
    const acl = await this.aclDataService.checkPermission(userId, resources);

    if (!acl) {
      return false;
    }

    return true;
  }
}
