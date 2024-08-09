import { Test, TestingModule } from '@nestjs/testing';
import { UserCompanyService } from '../user-company.service';
import { UserCompanyDataService } from '../user-company-data.service';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';
import { PaginationDto } from '../dto/user-company-pagination.dto';
import { Prisma } from '@prisma/client';

describe('UserCompanyService', () => {
  let userCompanyService: UserCompanyService;
  let userCompanyDataService: UserCompanyDataService;
  let alsProvider: AsyncLocalStorageProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCompanyService,
        {
          provide: UserCompanyDataService,
          useValue: {
            getAllCompanies: jest.fn(),
          },
        },
        {
          provide: AsyncLocalStorageProvider,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    userCompanyService = module.get<UserCompanyService>(UserCompanyService);
    userCompanyDataService = module.get<UserCompanyDataService>(
      UserCompanyDataService,
    );
    alsProvider = module.get<AsyncLocalStorageProvider>(
      AsyncLocalStorageProvider,
    );
  });

  it('should be defined', () => {
    expect(userCompanyService).toBeDefined();
  });

  describe('getAllCompanies', () => {
    it('should call getAllCompanies on UserCompanyDataService with correct parameters', async () => {
      const paginationDto: PaginationDto = {
        page: 1,
        limit: 10,
        type: 'ManagingCompany',
      };
      const userId = 1;
      const where: Prisma.CompanyWhereInput = {
        users: {
          some: { userId },
        },
        type: 'ManagingCompany',
      };

      jest.spyOn(alsProvider, 'get').mockReturnValue(userId);
      jest.spyOn(userCompanyDataService, 'getAllCompanies').mockResolvedValue({
        data: [],
        total: 0,
        page: paginationDto.page,
        limit: paginationDto.limit,
      });

      await userCompanyService.getAllCompanies(paginationDto);

      expect(alsProvider.get).toHaveBeenCalledWith('uId');
      expect(userCompanyDataService.getAllCompanies).toHaveBeenCalledWith(
        paginationDto.page,
        paginationDto.limit,
        where,
      );
    });

    it('should call getAllCompanies on UserCompanyDataService without type filter if type is not provided', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const userId = 1;
      const where: Prisma.CompanyWhereInput = {
        users: {
          some: { userId },
        },
      };

      jest.spyOn(alsProvider, 'get').mockReturnValue(userId);
      jest.spyOn(userCompanyDataService, 'getAllCompanies').mockResolvedValue({
        data: [],
        total: 0,
        page: paginationDto.page,
        limit: paginationDto.limit,
      });

      await userCompanyService.getAllCompanies(paginationDto);

      expect(alsProvider.get).toHaveBeenCalledWith('uId');
      expect(userCompanyDataService.getAllCompanies).toHaveBeenCalledWith(
        paginationDto.page,
        paginationDto.limit,
        where,
      );
    });
  });
});
