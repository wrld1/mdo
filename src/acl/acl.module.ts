import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AclDataService } from './acl-data.service';
import { AclService } from './acl.service';

@Module({
  imports: [PrismaModule],
  providers: [AclDataService, AclService],
  exports: [AclService, AclDataService],
})
export class AclModule {}
