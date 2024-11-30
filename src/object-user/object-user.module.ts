import { Module } from '@nestjs/common';
import { ObjectUserController } from './object-user.controller';
import { ObjectUserService } from './object-user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ObjectDataService } from 'src/object/object.data-service';
import { ObjectUserDataService } from './object-user.data-service';

@Module({
  imports: [PrismaModule, ObjectUserModule],
  controllers: [ObjectUserController],
  providers: [ObjectUserService, ObjectUserDataService],
  exports: [ObjectUserService, ObjectUserDataService],
})
export class ObjectUserModule {}
