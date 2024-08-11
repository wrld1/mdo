import { Test, TestingModule } from '@nestjs/testing';

import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { jwtConstants } from 'src/common/constants/auth.constants';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

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
            refreshAccessToken: jest.fn(),
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
    it('should call jwtService.verify and authService.refreshAccessToken with the correct parameters', async () => {
      const req = {
        cookies: {
          refreshToken: 'some-refresh-token',
        },
      } as unknown as Request;
      const res = {} as any;
      const user = { uId: 'user-id' };

      jest.spyOn(jwtService, 'verify').mockReturnValue(user);

      jest
        .spyOn(authService, 'refreshAccessToken')
        .mockResolvedValue({ accessToken: 'new-access-token' });

      await authController.refresh(req, res);

      expect(jwtService.verify).toHaveBeenCalledWith(req.cookies.refreshToken, {
        secret: jwtConstants.refreshSecret,
      });
      expect(authService.refreshAccessToken).toHaveBeenCalledWith(
        user.uId,
        req.cookies.refreshToken,
      );
    });

    it('should throw an UnauthorizedException if no refresh token is provided', async () => {
      const req = {
        cookies: {},
      } as unknown as Request;
      const res = {} as any;

      await expect(authController.refresh(req, res)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an UnauthorizedException if the refresh token is invalid', async () => {
      const req = {
        cookies: {
          refreshToken: 'invalid-refresh-token',
        },
      } as unknown as Request;
      const res = {} as any;

      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authController.refresh(req, res)).rejects.toThrow(
        UnauthorizedException,
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
