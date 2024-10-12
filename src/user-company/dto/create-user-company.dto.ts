import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { IUserCompany } from 'src/common/interfaces/user-company';

export class CreateUserCompanyDto implements IUserCompany {
  @ApiProperty({ description: 'The ID of the user', example: 1 })
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'The ID of the company',
    example: 'company-uuid-123',
  })
  @IsNotEmpty()
  @IsString()
  companyId: string;
}
