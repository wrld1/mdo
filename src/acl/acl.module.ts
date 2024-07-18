import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AclDataService } from './acl-data.service';

@Module({
  imports: [PrismaModule],
  providers: [AclDataService],
  exports: [AclDataService],
})
export class AclModule {}
