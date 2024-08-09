import { Test, TestingModule } from '@nestjs/testing';
import { UserCompanyService } from '../user-company.service';
import { PaginationDto } from '../dto/user-company-pagination.dto';
import { UserCompanyController } from '../user-company.controller';
import { CompanyType } from '@prisma/client';

describe('UserCompanyController', () => {
  let userCompanyController: UserCompanyController;
  let userCompanyService: UserCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCompanyController],
      providers: [
        {
          provide: UserCompanyService,
          useValue: {
            getAllCompanies: jest.fn(),
          },
        },
      ],
    }).compile();

    userCompanyController = module.get<UserCompanyController>(
      UserCompanyController,
    );
    userCompanyService = module.get<UserCompanyService>(UserCompanyService);
  });

  it('should be defined', () => {
    expect(userCompanyController).toBeDefined();
  });

  describe('getAllCompanies', () => {
    it('should call getAllCompanies method of UserCompanyService with correct paginationDto', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };

      const result = {
        data: [
          {
            id: 'company1',
            name: 'Company One',
            type: CompanyType.CottageTown,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'company2',
            name: 'Company Two',
            type: CompanyType.ManagingCompany,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
      };

      jest
        .spyOn(userCompanyService, 'getAllCompanies')
        .mockResolvedValue(result);

      expect(await userCompanyController.getAllCompanies(paginationDto)).toBe(
        result,
      );
      expect(userCompanyService.getAllCompanies).toHaveBeenCalledWith(
        paginationDto,
      );
    });
  });
});
