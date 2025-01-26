import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
import { ChangePasswordDto } from './dto/change-password.dto';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';
import { Mail } from 'src/common/enums/MailType';
import { CompanyTypeEnum } from 'src/common/enums/CompanyType';
import { AclPermission } from 'src/common/enums/Permission';
import { AclService } from 'src/acl/acl.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private userDataService: UserDataService,
    private emailService: EmailService,
    private alsProvider: AsyncLocalStorageProvider,
    private aclService: AclService,
  ) {}

  async register(
    user: IUser,
    company?: {
      code: number;
      type: CompanyTypeEnum;
    },
  ): Promise<void> {
    const existingUser = await this.usersService.findOneByEmail(user.email);

    if (existingUser) {
      throw new ConflictException('Користувач з таким email вже існує');
    }

    const createdUser = await this.userDataService.create(user);

    if (company) {
      const createdCompany = await this.usersService.assignCompanyToUser(
        company.code,
        company.type,
        createdUser.id,
      );

      const acl = await this.aclService.createAcl({
        userId: createdUser.id,
        resource: `/companyManagement/${createdCompany.id}`,
        permission: AclPermission.WRITE,
      });
    }
  }

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException(`Невірна пошта або пароль`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Невірна пошта або пароль');
    }

    const { accessToken, refreshToken } = await this.createTokens(user.id);

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(
    userId: number,
    rt: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOne(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const rtMatches = rt === user.refreshToken;

    if (!rtMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const accessToken = this.jwtService.sign({ uId: user.id });

    return { accessToken };
  }

  async assignRefreshToken(userId: number, rt: string): Promise<void> {
    await this.userDataService.update(userId, { refreshToken: rt });
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

      const resetPasswordLink = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${forgotPasswordToken}`;

      this.emailService.sendMail(email, Mail.resetPassword, resetPasswordLink);
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

      const user = await this.usersService.findOne(payload.uId);

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

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const userId = this.alsProvider.get('uId');
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new InternalServerErrorException();
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Невірний пароль');
    }

    await this.usersService.update(userId, {
      password: changePasswordDto.newPassword,
    });
  }

  async sendVerificationLink(email: string) {
    try {
      const user = await this.usersService.findOneByEmail(email);

      if (user) {
        const token = this.jwtService.sign(
          { uId: user.id },
          {
            secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
            expiresIn: '24h',
          },
        );

        const verificationLink = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;

        this.emailService.sendMail(email, Mail.verification, verificationLink);
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    return { message: 'Якщо цей користувач існує він отримає email' };
  }

  async verifyEmail(token: string): Promise<boolean> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (!payload) {
        throw new UnauthorizedException('Невірне посилання');
      }

      const user = await this.usersService.findOne(payload.uId);

      if (!user) {
        throw new BadRequestException('Щось пішло не так');
      }

      if (user.isVerified) {
        throw new BadRequestException('Email вже підтверджено');
      }

      await this.usersService.update(user.id, { isVerified: true });
      return true;
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Посилання вже неактивне');
      }
      throw new BadRequestException(error);
    }
  }
}
