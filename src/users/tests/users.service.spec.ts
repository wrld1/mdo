import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { CompaniesDataService } from 'src/companies/companies-data.service';
import { UserCompanyDataService } from 'src/user-company/user-company-data.service';
import { UserDataService } from '../user-data.service';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';
import { AclDataService } from 'src/acl/acl-data.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateAclDto } from 'src/acl/dto/create-acl.dto';
import { CompanyTypeEnum } from 'src/common/enums/CompanyType';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { roundsOfHashing } from 'src/common/utils/shared/hashPassword';
import { CompanyType } from '@prisma/client';
import { AclPermission } from 'src/common/enums/Permission';

describe('UsersService', () => {
  let usersService: UsersService;
  let companiesDataService: CompaniesDataService;
  let userCompanyDataService: UserCompanyDataService;
  let userDataService: UserDataService;
  let alsProvider: AsyncLocalStorageProvider;
  let aclDataService: AclDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: CompaniesDataService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: UserCompanyDataService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: UserDataService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            findOneByEmail: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: AsyncLocalStorageProvider,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: AclDataService,
          useValue: {
            createAcl: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    companiesDataService =
      module.get<CompaniesDataService>(CompaniesDataService);
    userCompanyDataService = module.get<UserCompanyDataService>(
      UserCompanyDataService,
    );
    userDataService = module.get<UserDataService>(UserDataService);
    alsProvider = module.get<AsyncLocalStorageProvider>(
      AsyncLocalStorageProvider,
    );
    aclDataService = module.get<AclDataService>(AclDataService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        isVerified: false,
      };

      const createdUser = {
        id: 1,
        email: createUserDto.email,
        isVerified: createUserDto.isVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userDataService, 'create').mockResolvedValue(createdUser);

      const result = await usersService.create(createUserDto);
      expect(result).toEqual(createdUser);
      expect(userDataService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('assignCompanyToUser', () => {
    it('should assign a company to a user', async () => {
      const name = 'Test Company';
      const type = CompanyType.OSBB;
      const userId = 1;
      const createdCompany = {
        id: 'stringId',
        name,
        type,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(companiesDataService, 'create')
        .mockResolvedValue(createdCompany);
      jest
        .spyOn(userCompanyDataService, 'create')
        .mockResolvedValue({ id: 1, userId, companyId: createdCompany.id });

      const result = await usersService.assignCompanyToUser(name, type, userId);
      expect(result).toEqual(createdCompany);
      expect(companiesDataService.create).toHaveBeenCalledWith({ name, type });
      expect(userCompanyDataService.create).toHaveBeenCalledWith({
        userId,
        companyId: createdCompany.id,
      });
    });
  });

  describe('createAcl', () => {
    it('should create a new ACL', async () => {
      const input: CreateAclDto = {
        userId: 1,
        resource: 'resource',
        permission: AclPermission.READ,
      };
      const createdAcl = { id: 1, ...input };

      jest.spyOn(aclDataService, 'createAcl').mockResolvedValue(createdAcl);

      const result = await usersService.createAcl(input);
      expect(result).toEqual(createdAcl);
      expect(aclDataService.createAcl).toHaveBeenCalledWith(input);
    });
  });

  describe('confirmEmail', () => {
    it('should confirm email if user is not already verified', async () => {
      const email = 'test@example.com';
      const user = {
        id: 1,
        email,
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: false,
        refreshToken: 'some-refresh-token',
      };
      const updateUserDto: UpdateUserDto = { isVerified: true };

      jest.spyOn(userDataService, 'findOneByEmail').mockResolvedValue(user);
      jest
        .spyOn(userDataService, 'update')
        .mockResolvedValue({ ...user, ...updateUserDto });

      await usersService.confirmEmail(email);

      expect(userDataService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(userDataService.update).toHaveBeenCalledWith(
        user.id,
        updateUserDto,
      );
    });

    it('should throw BadRequestException if user is not found', async () => {
      const email = 'test@example.com';

      jest.spyOn(userDataService, 'findOneByEmail').mockResolvedValue(null);

      await expect(usersService.confirmEmail(email)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if email is already confirmed', async () => {
      const email = 'test@example.com';
      const user = {
        id: 2,
        email,
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: true,
        refreshToken: 'some-refresh-token',
      };

      jest.spyOn(userDataService, 'findOneByEmail').mockResolvedValue(user);

      await expect(usersService.confirmEmail(email)).rejects.toThrow(
        BadRequestException,
      );
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
      jest.spyOn(userDataService, 'findAll').mockResolvedValue(users);

      const result = await usersService.findAll();
      expect(result).toEqual(users);
      expect(userDataService.findAll).toHaveBeenCalled();
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
      jest.spyOn(userDataService, 'findOneById').mockResolvedValue(user);

      const result = await usersService.findOneById(userId);
      expect(result).toEqual(user);
      expect(userDataService.findOneById).toHaveBeenCalledWith(userId);
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
      jest.spyOn(userDataService, 'findOneByEmail').mockResolvedValue(user);

      const result = await usersService.findOneByEmail(email);
      expect(result).toEqual(user);
      expect(userDataService.findOneByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('update', () => {
    // it('should update a user with hashed password if provided', async () => {
    //   const userId = 1;
    //   const updateUserDto: UpdateUserDto = { password: 'hashedPasswor2@11!d' };
    //   const hashedPassword = 'hashedPassword';
    //   const updatedUser = {
    //     id: userId,
    //     email: 'test@example.com',
    //     password: hashedPassword,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     isVerified: false,
    //     refreshToken: 'some-refresh-token',
    //   };

    //   jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
    //   jest.spyOn(userDataService, 'update').mockResolvedValue(updatedUser);

    //   const result = await usersService.update(userId, updateUserDto);
    //   expect(result).toEqual(updatedUser);
    //   expect(bcrypt.hash).toHaveBeenCalledWith(
    //     updateUserDto.password,
    //     roundsOfHashing,
    //   );
    //   expect(userDataService.update).toHaveBeenCalledWith(userId, {
    //     ...updateUserDto,
    //     password: hashedPassword,
    //   });
    // });

    it('should update a user without modifying the password if not provided', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = { email: 'newEmail@example.com' };
      const updatedUser = {
        id: userId,
        email: 'newEmail@example.com',
        password: 'existingPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: false,
        refreshToken: 'some-refresh-token',
      };

      jest.spyOn(userDataService, 'update').mockResolvedValue(updatedUser);

      const result = await usersService.update(userId, updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(userDataService.update).toHaveBeenCalledWith(
        userId,
        updateUserDto,
      );
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
      jest.spyOn(userDataService, 'remove').mockResolvedValue(removedUser);

      const result = await usersService.remove(userId);
      expect(result).toEqual(removedUser);
      expect(userDataService.remove).toHaveBeenCalledWith(userId);
    });
  });
});
