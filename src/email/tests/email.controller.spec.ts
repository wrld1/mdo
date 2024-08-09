import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from '../email.controller';
import EmailService from '../email.service';

describe('EmailController', () => {
  let emailController: EmailController;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        {
          provide: EmailService,
          useValue: {
            sendVerificationEmail: jest.fn(),
            sendResetPasswordLink: jest.fn(),
          },
        },
      ],
    }).compile();

    emailController = module.get<EmailController>(EmailController);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(emailController).toBeDefined();
  });

  describe('sendVerificationEmail', () => {
    it('should call sendVerificationEmail method of EmailService', async () => {
      await emailController.sendVerificationEmail();
      expect(emailService.sendVerificationEmail).toHaveBeenCalled();
    });
  });

  describe('sendResetLink', () => {
    it('should call sendResetPasswordLink method of EmailService with email data', async () => {
      const emailData = { email: 'test@example.com' };
      await emailController.sendResetLink(emailData);
      expect(emailService.sendResetPasswordLink).toHaveBeenCalledWith(
        emailData.email,
      );
    });
  });
});
