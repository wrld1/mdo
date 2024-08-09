import { Test, TestingModule } from '@nestjs/testing';

import { AclDataService } from 'src/acl/acl-data.service';
import { AsyncLocalStorageProvider } from 'src/providers/als/als.provider';

import { ForbiddenException } from '@nestjs/common';
import { CompaniesDataService } from '../companies-data.service';
import { CompaniesService } from '../companies.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let companiesDataService: CompaniesDataService;
  let aclDataService: AclDataService;
  let alsProvider: AsyncLocalStorageProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: CompaniesDataService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: AclDataService,
          useValue: {
            checkPermission: jest.fn(),
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

    service = module.get<CompaniesService>(CompaniesService);
    companiesDataService =
      module.get<CompaniesDataService>(CompaniesDataService);
    aclDataService = module.get<AclDataService>(AclDataService);
    alsProvider = module.get<AsyncLocalStorageProvider>(
      AsyncLocalStorageProvider,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call companiesDataService.create with the correct data', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Test Company',
        type: 'CottageTown',
      };
      await service.create(createCompanyDto);
      expect(companiesDataService.create).toHaveBeenCalledWith({
        ...createCompanyDto,
      });
    });
  });

  describe('update', () => {
    it('should call aclDataService.checkPermission and throw ForbiddenException if no permission', async () => {
      const id = 'test-id';
      const updateCompanyDto: UpdateCompanyDto = { name: 'Updated Company' };
      const userId = 'user-id';

      jest.spyOn(alsProvider, 'get').mockReturnValue(userId);
      jest.spyOn(aclDataService, 'checkPermission').mockResolvedValue(false);

      await expect(service.update(id, updateCompanyDto)).rejects.toThrow(
        ForbiddenException,
      );
      expect(alsProvider.get).toHaveBeenCalledWith('uId');
      expect(aclDataService.checkPermission).toHaveBeenCalledWith(userId, id);
      expect(companiesDataService.update).not.toHaveBeenCalled();
    });

    it('should call companiesDataService.update if user has permission', async () => {
      const id = 'test-id';
      const updateCompanyDto: UpdateCompanyDto = { name: 'Updated Company' };
      const userId = 'user-id';

      jest.spyOn(alsProvider, 'get').mockReturnValue(userId);
      jest.spyOn(aclDataService, 'checkPermission').mockResolvedValue(true);

      await service.update(id, updateCompanyDto);
      expect(companiesDataService.update).toHaveBeenCalledWith(
        id,
        updateCompanyDto,
      );
    });
  });

  describe('delete', () => {
    it('should call companiesDataService.delete with the correct id', async () => {
      const id = 'test-id';
      await service.delete(id);
      expect(companiesDataService.delete).toHaveBeenCalledWith(id);
    });
  });
});
