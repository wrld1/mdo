import { Module } from '@nestjs/common';
import { ObjectService } from './object.service';
import { ObjectController } from './object.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ObjectDataService } from './object.data-service';

@Module({
  imports: [PrismaModule],
  providers: [ObjectService, ObjectDataService],
  exports: [ObjectService, ObjectDataService],
  controllers: [ObjectController],
})
export class ObjectModule {}
