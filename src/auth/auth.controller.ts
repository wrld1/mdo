import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants/auth.constants';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Public } from '../common/decorators/public';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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
    return this.authService.register(createUserDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Post('refresh')
  async refresh(@Body() { refreshToken }: RefreshTokenDto) {
    const user = this.jwtService.verify(refreshToken, {
      secret: jwtConstants.refreshSecret,
    });
    return this.authService.refreshTokens(user.uId, refreshToken);
  }

  @Get('verify')
  @Redirect()
  async verifyEmail(@Query('token') token: string) {
    const isVerified = await this.authService.verifyEmail(token);
    if (isVerified) {
      return { url: '/verification-success', statusCode: 302 };
    } else {
      return { url: '/verification-failed', statusCode: 302 };
    }
  }
}
