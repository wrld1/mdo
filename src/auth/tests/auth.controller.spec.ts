import { Test, TestingModule } from '@nestjs/testing';

import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { jwtConstants } from 'src/common/constants/auth.constants';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            refreshTokens: jest.fn(),
            verifyEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should call authService.register with the correct parameters', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        isVerified: false,
      };
      await authController.register(createUserDto);
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should call authService.login with the correct parameters', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      await authController.login(loginDto);
      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
    });
  });

  describe('refresh', () => {
    it('should call jwtService.verify and authService.refreshTokens with the correct parameters', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'some-refresh-token',
      };
      const user = { uId: 'user-id' };
      (jwtService.verify as jest.Mock).mockReturnValue(user);

      await authController.refresh(refreshTokenDto);

      expect(jwtService.verify).toHaveBeenCalledWith(
        refreshTokenDto.refreshToken,
        {
          secret: jwtConstants.refreshSecret,
        },
      );
      expect(authService.refreshTokens).toHaveBeenCalledWith(
        user.uId,
        refreshTokenDto.refreshToken,
      );
    });
  });

  describe('verifyEmail', () => {
    it('should return a redirection to /verification-success if email is verified', async () => {
      const token = 'verification-token';
      (authService.verifyEmail as jest.Mock).mockResolvedValue(true);

      const result = await authController.verifyEmail(token);

      expect(authService.verifyEmail).toHaveBeenCalledWith(token);
      expect(result).toEqual({ url: '/verification-success', statusCode: 302 });
    });

    it('should return a redirection to /verification-failed if email is not verified', async () => {
      const token = 'verification-token';
      (authService.verifyEmail as jest.Mock).mockResolvedValue(false);

      const result = await authController.verifyEmail(token);

      expect(authService.verifyEmail).toHaveBeenCalledWith(token);
      expect(result).toEqual({ url: '/verification-failed', statusCode: 302 });
    });
  });
});
