import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDataService } from './user-data.service';

@Module({
  providers: [UsersService, PrismaService, UserDataService],
  exports: [UsersService, UserDataService],
  controllers: [UsersController],
})
export class UsersModule {}
