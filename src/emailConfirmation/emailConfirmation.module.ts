import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';
import { UsersModule } from 'src/users/users.module';
import { EmailConfirmationController } from './emailConfirmation.controller';
import { EmailConfirmationService } from './emailConfirmation.service';

@Module({
  imports: [EmailModule, ConfigModule, UsersModule],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
  controllers: [EmailConfirmationController],
})
export class EmailConfirmationModule {}