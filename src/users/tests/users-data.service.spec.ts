import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword } from 'src/common/utils/shared/hashPassword';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDataService } from '../user-data.service';

// Mock PrismaService
const mockPrismaService = () => ({
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

jest.mock('src/common/utils/shared/hashPassword', () => ({
  hashPassword: jest.fn(),
}));

describe('UserDataService', () => {
  let userDataService: UserDataService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDataService,
        { provide: PrismaService, useFactory: mockPrismaService },
      ],
    }).compile();

    userDataService = module.get<UserDataService>(UserDataService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        isVerified: false,
      };
      const hashedPassword = 'hashedPassword';
      const user = {
        id: 1,
        email: createUserDto.email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: createUserDto.isVerified,
        refreshToken: 'some-refresh-token',
      };

      const mockHashPassword = hashPassword as jest.Mock;

      mockHashPassword.mockResolvedValue(hashedPassword);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(user);

      const result = await userDataService.create(createUserDto);
      expect(result).toEqual({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isVerified: user.isVerified,
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: { ...createUserDto, password: hashedPassword },
      });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: 1,
          email: 'test@example.com',
          password: 'hashed-password',
          createdAt: new Date(),
          updatedAt: new Date(),
          isVerified: false,
          refreshToken: 'some-refresh-token',
        },
      ];

      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);

      const result = await userDataService.findAll();
      expect(result).toEqual(users);
      expect(prismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const user = {
        id: userId,
        email: 'test@example.com',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: false,
        refreshToken: 'some-refresh-token',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      const result = await userDataService.findOneById(userId);
      expect(result).toEqual(user);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const user = {
        id: 1,
        email,
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: false,
        refreshToken: 'some-refresh-token',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      const result = await userDataService.findOneByEmail(email);
      expect(result).toEqual(user);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = { email: 'new@example.com' };
      const updatedUser = {
        id: userId,
        email: 'new@example.com',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: false,
        refreshToken: 'some-refresh-token',
      };

      jest.spyOn(prismaService.user, 'update').mockResolvedValue(updatedUser);

      const result = await userDataService.update(userId, updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateUserDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a user by id', async () => {
      const userId = 1;
      const removedUser = {
        id: userId,
        email: 'test@example.com',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: false,
        refreshToken: 'some-refresh-token',
      };

      jest.spyOn(prismaService.user, 'delete').mockResolvedValue(removedUser);

      const result = await userDataService.remove(userId);
      expect(result).toEqual(removedUser);
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });
});
