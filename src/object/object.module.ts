import { Module } from '@nestjs/common';
import { ObjectService } from './object.service';
import { ObjectController } from './object.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ObjectDataService } from './object.data-service';
import { ObjectUserModule } from 'src/object-user/object-user.module';

@Module({
  imports: [PrismaModule, ObjectUserModule],
  providers: [ObjectService, ObjectDataService],
  exports: [ObjectService],
  controllers: [ObjectController],
})
export class ObjectModule {}
