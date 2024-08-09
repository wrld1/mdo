import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCompanyDataService } from '../user-company-data.service';
import { Prisma, CompanyType } from '@prisma/client';

describe('UserCompanyDataService', () => {
  let userCompanyDataService: UserCompanyDataService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCompanyDataService,
        {
          provide: PrismaService,
          useValue: {
            company: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
            userCompany: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    userCompanyDataService = module.get<UserCompanyDataService>(
      UserCompanyDataService,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(userCompanyDataService).toBeDefined();
  });

  describe('getAllCompanies', () => {
    it('should return a paginated list of companies', async () => {
      const mockCompanies = [
        {
          id: '1',
          name: 'Company One',
          createdAt: new Date(),
          updatedAt: new Date(),
          type: CompanyType.OSBB,
        },
        {
          id: '2',
          name: 'Company Two',
          createdAt: new Date(),
          updatedAt: new Date(),
          type: CompanyType.CottageTown,
        },
      ];
      const mockTotal = 2;

      jest
        .spyOn(prismaService.company, 'findMany')
        .mockResolvedValue(mockCompanies);
      jest.spyOn(prismaService.company, 'count').mockResolvedValue(mockTotal);

      const page = 1;
      const limit = 10;
      const where: Prisma.CompanyWhereInput = { type: CompanyType.OSBB };

      const result = await userCompanyDataService.getAllCompanies(
        page,
        limit,
        where,
      );

      expect(prismaService.company.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: limit,
        where,
      });
      expect(prismaService.company.count).toHaveBeenCalledWith({ where });
      expect(result).toEqual({
        data: mockCompanies,
        total: mockTotal,
        page,
        limit,
      });
    });
  });

  describe('create', () => {
    it('should create a new user-company relationship', async () => {
      const createUserCompanyDto = { userId: 1, companyId: 'company1' };
      const mockUserCompany = {
        id: 1,
        userId: 1,
        companyId: 'company1',
      };

      jest
        .spyOn(prismaService.userCompany, 'create')
        .mockResolvedValue(mockUserCompany);

      const result = await userCompanyDataService.create(createUserCompanyDto);

      expect(prismaService.userCompany.create).toHaveBeenCalledWith({
        data: createUserCompanyDto,
      });
      expect(result).toEqual(mockUserCompany);
    });
  });
});
