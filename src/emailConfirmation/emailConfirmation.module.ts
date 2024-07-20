import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';
import { UsersModule } from 'src/users/users.module';
import { EmailConfirmationService } from './emailConfirmation.service';

@Module({
  imports: [EmailModule, ConfigModule, UsersModule],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
