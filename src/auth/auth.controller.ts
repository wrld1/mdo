import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
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
import { Request } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { sendVerificationLinkDto } from './dto/send-verification-link.dto';
import { VerifyDto } from './dto/verify-dto';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user/user with assigned company' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('sign-up')
  async register(@Body() createUserDto: CreateUserDto): Promise<void> {
    const { email, password, company } = createUserDto;

    return await this.authService.register({ email, password }, company);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() { email, password }: LoginDto) {
    return await this.authService.login(email, password);
  }

  @Public()
  @Get('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiCookieAuth('refreshToken')
  @ApiResponse({
    status: 200,
    description: 'Access token successfully refreshed.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refresh(@Req() req: Request) {
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
      console.log('error happened in controller', error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @Public()
  @Patch('verify')
  @ApiOperation({ summary: 'Verify user email' })
  @ApiBody({ type: VerifyDto })
  @ApiResponse({
    status: 200,
    description: 'Email successfully verified.',
  })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  async verifyEmail(@Body() { token }: VerifyDto) {
    return await this.authService.verifyEmail(token);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset link' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset link successfully sent.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return await this.authService.forgotPassword(email);
  }

  @Public()
  @Patch('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password successfully reset.',
  })
  @ApiResponse({ status: 400, description: 'Invalid reset token' })
  async resetPassword(@Body() { resetToken, newPassword }: ResetPasswordDto) {
    return await this.authService.resetPassword(resetToken, newPassword);
  }

  @Post('verification-email')
  @ApiOperation({ summary: 'Send verification email' })
  @ApiBody({ type: sendVerificationLinkDto })
  @ApiResponse({
    status: 200,
    description: 'Verification email successfully sent.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async sendVerificationLink(@Body() { email }: sendVerificationLinkDto) {
    return await this.authService.sendVerificationLink(email);
  }

  // @Public()
  // @Get('send-otp')
  // @ApiOperation({ summary: 'Send otp code' })
  // // @ApiBody({ type: string })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Otp successfully sent',
  // })
  // @ApiResponse({ status: 400, description: 'Invalid reset token' })
  // async sendOtp(@Body('phoneNumber') phoneNumber: string) {
  //   return await this.authService.sendOtp(phoneNumber);
  // }
}
