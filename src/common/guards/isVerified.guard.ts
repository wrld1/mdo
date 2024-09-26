import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class isVerifiedGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    const foundUser = await this.usersService.findOneById(user.uId);

    if (foundUser && foundUser.isVerified) {
      return true;
    }

    throw new ForbiddenException('Користувач не підтвердив акаунт');
  }
}
