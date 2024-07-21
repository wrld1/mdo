import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from 'src/common/constants/auth.constants';
import { IUser } from 'src/common/interfaces/user';
import { UserDataService } from 'src/users/user-data.service';
import { UsersService } from 'src/users/users.service';
import { AuthEntity } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private userDataService: UserDataService,
  ) {}

  async register(user: IUser): Promise<void> {
    const existingUser = await this.usersService.findOneByEmail(user.email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    await this.userDataService.create(user);
  }

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return await this.createTokens(user.id);
  }

  async refreshTokens(userId: number, rt: string): Promise<AuthEntity> {
    const user = await this.usersService.findOneById(userId);

    if (!user || !user.hashedRt) {
      throw new UnauthorizedException('Access Denied');
    }

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    return await this.createTokens(user.id);
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const hashedRt = await bcrypt.hash(refreshToken, 10);
    await this.userDataService.update(userId, { hashedRt });
  }

  async createTokens(uId: number): Promise<AuthEntity> {
    const accessToken = this.jwtService.sign({ uId });
    const refreshToken = this.jwtService.sign(
      { uId },
      { secret: jwtConstants.refreshSecret, expiresIn: '7d' },
    );

    await this.updateRefreshToken(uId, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}
