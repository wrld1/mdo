import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from '../companies.service';
import { CompaniesController } from '../companies.controller';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyTypeEnum } from 'src/common/enums/CompanyType';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let service: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        {
          provide: CompaniesService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
    service = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a company', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Test Company',
        type: 'ManagingCompany',
      };
      const expectedResult = {
        id: 'some-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...createCompanyDto,
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      expect(await controller.create(createCompanyDto)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createCompanyDto);
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const id = 'some-id';
      const updateCompanyDto: UpdateCompanyDto = {
        name: 'Updated Company Name',
        type: 'OSBB',
      };
      const expectedResult = {
        id,
        name: updateCompanyDto.name,
        type: updateCompanyDto.type,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      expect(await controller.update(id, updateCompanyDto)).toBe(
        expectedResult,
      );
      expect(service.update).toHaveBeenCalledWith(id, updateCompanyDto);
    });
  });

  describe('delete', () => {
    it('should delete a company', async () => {
      const id = 'some-id';
      const expectedResult = {
        id: 'some-id',
        name: 'Updated Company Name',
        type: 'OSBB' as CompanyTypeEnum,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'delete').mockResolvedValue(expectedResult);

      expect(await controller.delete(id)).toBe(expectedResult);
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
