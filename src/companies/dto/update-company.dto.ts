import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Company, CompanyTypeEnum } from 'src/common/enums/CompanyType';

export class UpdateCompanyDto {
  @ApiProperty({
    description: 'The name of the company',
    example: 'My Company',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The code associated with the company',
    example: 2546646,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  code?: number;

  @ApiProperty({
    description: 'The type of the company',
    enum: Company,
    required: false,
  })
  @IsOptional()
  @IsEnum(Company)
  type?: CompanyTypeEnum;
}
