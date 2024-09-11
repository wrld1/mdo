import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createTransport } from 'nodemailer';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';
import { UsersService } from 'src/users/users.service';
import EmailService from '../email.service';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn(),
  }),
}));

describe('EmailService', () => {
  let emailService: EmailService;
  let configService: ConfigService;
  let jwtService: JwtService;
  let alsProvider: AsyncLocalStorageProvider;
  let usersService: UsersService;
  let nodemailerTransport: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        ConfigService,
        JwtService,
        AsyncLocalStorageProvider,
        UsersService,
      ],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
    alsProvider = module.get<AsyncLocalStorageProvider>(
      AsyncLocalStorageProvider,
    );
    usersService = module.get<UsersService>(UsersService);
    nodemailerTransport = (emailService as any).nodemailerTransport;

    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      const config = {
        EMAIL_HOST: 'gmail',
        SMTP_PORT: '587',
        EMAIL_USER: 'test@example.com',
        EMAIL_PASSWORD: 'password',
        JWT_VERIFICATION_TOKEN_SECRET: 'secret',
        FRONTEND_URL: 'http://localhost:3001',
      };
      return config[key];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendVerificationEmail', () => {
    it('should send a verification email', async () => {
      const userId = '123';
      const email = 'test@example.com';

      jest.spyOn(alsProvider, 'get').mockReturnValue(userId);
      jest.spyOn(usersService, 'findOneById').mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: true,
        refreshToken: 'someRefreshToken',
      });
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');
      const sendMailSpy = jest
        .spyOn(nodemailerTransport, 'sendMail')
        .mockResolvedValue(null);

      await emailService.sendVerificationEmail();

      expect(alsProvider.get).toHaveBeenCalledWith('uId');
      expect(usersService.findOneById).toHaveBeenCalledWith(userId);
      expect(jwtService.sign).toHaveBeenCalledWith(
        { uId: userId },
        { secret: 'secret', expiresIn: '24h' },
      );
      expect(sendMailSpy).toHaveBeenCalledWith({
        to: email,
        subject: 'Verify Your Email',
        html: expect.stringContaining('Verify Email'),
      });
    });

    it('should log an error if email sending fails', async () => {
      const error = new Error('Email sending failed');
      jest.spyOn(nodemailerTransport, 'sendMail').mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await emailService.sendVerificationEmail();

      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('sendResetPasswordLink', () => {
    it('should send a reset password link', async () => {
      const email = 'test@example.com';
      const sendMailSpy = jest
        .spyOn(nodemailerTransport, 'sendMail')
        .mockResolvedValue(null);

      await emailService.sendResetPasswordLink(email);

      expect(sendMailSpy).toHaveBeenCalledWith({
        to: email,
        from: 'Osbb management system',
        subject: 'Reset password on Osbb management system',
        text: 'Reset Password',
        html: expect.stringContaining('Reset Password'),
      });
    });

    it('should log an error if reset password link sending fails', async () => {
      const error = new Error('Email sending failed');
      jest.spyOn(nodemailerTransport, 'sendMail').mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await emailService.sendResetPasswordLink('test@example.com');

      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    });
  });
});
