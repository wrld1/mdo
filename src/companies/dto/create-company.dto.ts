import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Company, CompanyTypeEnum } from 'src/common/enums/CompanyType';
import { ICompany } from 'src/common/interfaces/company';

export class CreateCompanyDto implements ICompany {
  @ApiProperty({
    description: 'The unique edrpou code of the company',
    example: 123,
  })
  @IsNumber()
  @IsNotEmpty()
  code: number;

  @ApiProperty({
    description: 'The type of the company',
    enum: Company,
    example: 'OSBB',
  })
  @IsEnum(Company)
  @IsNotEmpty()
  type: CompanyTypeEnum;
}
