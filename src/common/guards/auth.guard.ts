import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from 'src/common/constants/auth.constants';

import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';
import { IS_PUBLIC_KEY } from '../decorators/public';
import { PrismaService } from 'src/prisma/prisma.service';
import { FraudStatus } from '@prisma/client';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private alsProvider: AsyncLocalStorageProvider,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided!');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.accessSecret,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.uId },
        select: { fraudStatus: true },
      });

      if (user?.fraudStatus === FraudStatus.BLOCKED) {
        throw new UnauthorizedException(
          'Акаунт заблоковано через підозрілу активність',
        );
      }

      request['user'] = payload;
      this.alsProvider.set('uId', payload.uId);
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
