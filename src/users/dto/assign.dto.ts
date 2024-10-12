import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Company, CompanyTypeEnum } from 'src/common/enums/CompanyType';
import { IAssign } from 'src/common/interfaces/assign';

export class Assign implements IAssign {
  @ApiProperty({
    description: 'The code associated with the assignment',
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
