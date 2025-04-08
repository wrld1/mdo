import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import EmailService from './email.service';
import { UsersModule } from 'src/users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailServiceFactory } from './email-factory.service';

@Module({
  imports: [
    UsersModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          transport: {
            host: config.get('EMAIL_HOST'),
            secure: false,
            auth: {
              user: config.get('EMAIL_USER'),
              pass: config.get('EMAIL_PASSWORD'),
            },
          },
          defaults: {
            from: `"Osbb management system" <${config.get('EMAIL_FROM')}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: 'MAIL_PROVIDER',
      useFactory: () => MailServiceFactory.createMailService(),
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
