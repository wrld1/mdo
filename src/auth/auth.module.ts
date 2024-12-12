import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants/auth.constants';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AsyncLocalStorageModule } from 'src/providers/als/als.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';
import { AclModule } from 'src/acl/acl.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AsyncLocalStorageModule,
    ConfigModule,
    EmailModule,
    AclModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.accessSecret,
      signOptions: { expiresIn: jwtConstants.accessExpiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
