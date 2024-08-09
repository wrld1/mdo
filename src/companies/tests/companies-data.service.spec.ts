import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from 'src/prisma/prisma.service';
import { CompaniesDataService } from '../companies-data.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';

describe('CompaniesDataService', () => {
  let service: CompaniesDataService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesDataService,
        {
          provide: PrismaService,
          useValue: {
            company: {
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CompaniesDataService>(CompaniesDataService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call prisma.company.create with the correct data', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Test Company',
        type: 'OSBB',
      };
      await service.create(createCompanyDto);
      expect(prismaService.company.create).toHaveBeenCalledWith({
        data: createCompanyDto,
      });
    });
  });

  describe('update', () => {
    it('should call prisma.company.update with the correct id and data', async () => {
      const id = 'test-id';
      const updateCompanyDto: UpdateCompanyDto = { name: 'Updated Company' };
      await service.update(id, updateCompanyDto);
      expect(prismaService.company.update).toHaveBeenCalledWith({
        where: { id },
        data: updateCompanyDto,
      });
    });
  });

  describe('delete', () => {
    it('should call prisma.company.delete with the correct id', async () => {
      const id = 'test-id';
      await service.delete(id);
      expect(prismaService.company.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
