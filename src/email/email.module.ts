import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import EmailService from './email.service';

@Module({
  imports: [ConfigModule],
  providers: [EmailService],
  exports: [EmailService], //sdelat v module setup pochti(mail), (microservice)
})
export class EmailModule {}
