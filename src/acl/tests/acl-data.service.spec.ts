import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';

import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AclDataService } from '../acl-data.service';
import { CreateAclDto } from '../dto/create-acl.dto';
import { AclPermission } from 'src/common/enums/Permission';

describe('AclDataService', () => {
  let aclDataService: AclDataService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AclDataService,
        {
          provide: PrismaService,
          useValue: {
            acl: {
              create: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    aclDataService = module.get<AclDataService>(AclDataService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAcl', () => {
    it('should create a new ACL entry', async () => {
      const input: CreateAclDto = {
        userId: 1,
        resource: '/company/123',
        permission: AclPermission.READ,
      };

      const createdAcl = {
        id: 1,
        userId: 1,
        resource: '/company/123',
        permission: AclPermission.READ,
      };

      jest.spyOn(prismaService.acl, 'create').mockResolvedValue(createdAcl);

      const result = await aclDataService.createAcl(input);

      expect(result).toEqual(createdAcl);
      expect(prismaService.acl.create).toHaveBeenCalledWith({
        data: input,
      });
    });
  });

  describe('checkPermission', () => {
    it('should return true if user is a manager', async () => {
      const userId = 1;
      const companyId = '123';
      const acl = {
        id: 1,
        userId,
        resource: `/companyManagement/${companyId}`,
        permission: AclPermission.WRITE,
      };

      jest.spyOn(prismaService.acl, 'findFirst').mockResolvedValue(acl);

      const result = await aclDataService.checkPermission(userId, companyId);

      expect(result).toBe(true);
      expect(prismaService.acl.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          resource: {
            in: [`/companyManagement/${companyId}`, `/company/${companyId}`],
          },
        },
      });
    });

    it('should return false if user is not a manager', async () => {
      const userId = 1;
      const companyId = '123';
      const acl = {
        id: 1,
        userId,
        resource: `/company/${companyId}`,
        permission: AclPermission.READ,
      };

      jest.spyOn(prismaService.acl, 'findFirst').mockResolvedValue(acl);

      const result = await aclDataService.checkPermission(userId, companyId);

      expect(result).toBe(false);
      expect(prismaService.acl.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          resource: {
            in: [`/companyManagement/${companyId}`, `/company/${companyId}`],
          },
        },
      });
    });

    it('should throw NotFoundException if no ACL entry is found', async () => {
      const userId = 1;
      const companyId = '123';

      jest.spyOn(prismaService.acl, 'findFirst').mockResolvedValue(null);

      await expect(
        aclDataService.checkPermission(userId, companyId),
      ).rejects.toThrow(NotFoundException);
      expect(prismaService.acl.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          resource: {
            in: [`/companyManagement/${companyId}`, `/company/${companyId}`],
          },
        },
      });
    });

    it('should throw ForbiddenException if ACL entry resource is invalid', async () => {
      const userId = 1;
      const companyId = '123';
      const acl = {
        id: 1,
        userId,
        resource: `/otherResource/${companyId}`,
        permission: AclPermission.READ,
      };

      jest.spyOn(prismaService.acl, 'findFirst').mockResolvedValue(acl);

      await expect(
        aclDataService.checkPermission(userId, companyId),
      ).rejects.toThrow(ForbiddenException);
      expect(prismaService.acl.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          resource: {
            in: [`/companyManagement/${companyId}`, `/company/${companyId}`],
          },
        },
      });
    });
  });
});
