import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  Query,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants/auth.constants';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Public } from '../common/decorators/public';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Request } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-pasword.dto';
import { sendVerificationLinkDto } from './dto/send-verification-link.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async register(@Body() createUserDto: CreateUserDto): Promise<void> {
    return await this.authService.register(createUserDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async login(@Body() { email, password }: LoginDto) {
    return await this.authService.login(email, password);
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    try {
      const user = this.jwtService.verify(refreshToken, {
        secret: jwtConstants.refreshSecret,
      });
      return await this.authService.refreshAccessToken(user.uId, refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @Patch('verify')
  async verifyEmail(@Body() token: string) {
    return await this.authService.verifyEmail(token);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return await this.authService.forgotPassword(email);
  }

  @Public()
  @Patch('reset-password')
  async resetPassword(@Body() { resetToken, newPassword }: ResetPasswordDto) {
    return await this.authService.resetPassword(resetToken, newPassword);
  }

  @Post('verification-email')
  async sendVerificationLink(@Body() { email }: sendVerificationLinkDto) {
    return await this.authService.sendVerificationLink(email);
  }

  @Patch('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return await this.authService.changePassword(changePasswordDto);
  }
}
