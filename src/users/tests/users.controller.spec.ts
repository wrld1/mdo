import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { Assign } from '../dto/assign.dto';
import { AclPermission } from 'src/common/enums/Permission';
import { Company, CompanyType, User } from '@prisma/client';
import { CreateAclDto } from '../../acl/dto/create-acl.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            assignCompanyToUser: jest.fn(),
            createAcl: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const result: User[] = [
        {
          id: 1,
          email: 'user1@example.com',
          password: 'hashedpassword',
          createdAt: new Date(),
          updatedAt: new Date(),
          isVerified: true,
          refreshToken: 'token1',
        },
        {
          id: 2,
          email: 'user2@example.com',
          password: 'hashedpassword2',
          createdAt: new Date(),
          updatedAt: new Date(),
          isVerified: false,
          refreshToken: 'token2',
        },
      ];
      jest.spyOn(usersService, 'findAll').mockResolvedValue(result);

      expect(await controller.getUsers({} as any)).toBe(result);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('userAssign', () => {
    it('should assign a company to a user', async () => {
      const assignDto: Assign = { name: 'Company', type: 'OSBB' };
      const userId = 1;
      const result: Company = {
        id: 'company1',
        name: 'Company',
        type: CompanyType.OSBB,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(usersService, 'assignCompanyToUser').mockResolvedValue(result);

      expect(await controller.userAssign(userId, assignDto)).toBe(result);
      expect(usersService.assignCompanyToUser).toHaveBeenCalledWith(
        'Company',
        'OSBB',
        userId,
      );
    });
  });

  describe('createAcl', () => {
    it('should create an ACL', async () => {
      const createAclDto: CreateAclDto = {
        userId: 0,
        resource: '/companyManagement/1',
        permission: AclPermission.READ,
      };
      const result = { id: 1, ...createAclDto };
      jest.spyOn(usersService, 'createAcl').mockResolvedValue(result);

      expect(await controller.createAcl(createAclDto)).toBe(result);
      expect(usersService.createAcl).toHaveBeenCalledWith(createAclDto);
    });
  });
});
