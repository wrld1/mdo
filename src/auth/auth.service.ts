import {
  BadRequestException,
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
import { ConfigService } from '@nestjs/config';
import EmailService from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private userDataService: UserDataService,
    private emailService: EmailService,
  ) {}

  async register(user: IUser): Promise<void> {
    const existingUser = await this.usersService.findOneByEmail(user.email);

    if (existingUser) {
      throw new ConflictException('Користувач з таким email вже існує');
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

    const { accessToken, refreshToken } = await this.createTokens(user.id);

    return { accessToken, refreshToken };
  }

  async verifyEmail(token: string): Promise<boolean> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });
      const user = await this.usersService.findOneById(payload.uId);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.isVerified) {
        throw new BadRequestException('Email already confirmed');
      }

      await this.usersService.update(user.id, { isVerified: true });
      return true;
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async refreshAccessToken(
    userId: number,
    rt: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOneById(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const rtMatches = await bcrypt.compare(rt, user.refreshToken);
    if (!rtMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const accessToken = this.jwtService.sign({ uId: user.id });

    return { accessToken };
  }

  async assignRefreshToken(userId: number, rt: string): Promise<void> {
    const refreshToken = await bcrypt.hash(rt, 10);
    await this.userDataService.update(userId, { refreshToken });
  }

  async createTokens(uId: number): Promise<AuthEntity> {
    const accessToken = this.jwtService.sign({ uId });
    const refreshToken = this.jwtService.sign(
      { uId },
      {
        secret: jwtConstants.refreshSecret,
        expiresIn: jwtConstants.refreshExpiresIn,
      },
    );

    await this.assignRefreshToken(uId, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getUserByRefreshToken(
    refreshToken: string,
  ): Promise<{ userId: number } | null> {
    const users = await this.userDataService.findAll();
    for (const user of users) {
      const rtMatches = await bcrypt.compare(refreshToken, user.refreshToken);
      if (rtMatches) {
        return { userId: user.id };
      }
    }
    return null;
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      const forgotPasswordToken = this.jwtService.sign(
        { uId: user.id },
        {
          secret: jwtConstants.resetPasswordSecret,
          expiresIn: jwtConstants.resetPasswordExpiresIn,
        },
      );

      this.emailService.sendResetPasswordLink(email, forgotPasswordToken);
    }

    return { message: 'Якщо цей користувач існує він отримає email' };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(resetToken, {
        secret: this.configService.get('JWT_RESET_PASSWORD_TOKEN_SECRET'),
      });

      if (!payload) {
        throw new UnauthorizedException('Невірне посилання');
      }

      const user = await this.usersService.findOneById(payload.uId);

      if (!user) {
        throw new BadRequestException('Не вдалося оновити пароль');
      }

      await this.usersService.update(user.id, { password: newPassword });
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException(
          'Час дії посилання сплинув. Спробуйте дати запит на відновлення паролю знову',
        );
      }
      throw new BadRequestException('Невірне посилання');
    }
  }
}
