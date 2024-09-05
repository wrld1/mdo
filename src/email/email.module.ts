import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import EmailService from './email.service';

import { EmailController } from './email.controller';
import { AsyncLocalStorageModule } from 'src/providers/als/als.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ConfigModule, UsersModule],
  providers: [EmailService],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
