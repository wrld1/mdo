import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { Order } from 'src/common/interfaces/order';

export class CreateOrderDto
  implements
    Pick<
      Order,
      | 'name'
      | 'description'
      | 'objectId'
      | 'dwellingId'
      | 'userId'
      | 'companyId'
      | 'responsibleUserId'
    >
{
  @ApiProperty({ description: 'Order name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Order description' })
  @IsString()
  @MinLength(50)
  description: string;

  @ApiProperty({ description: 'Object ID' })
  @IsString()
  objectId: string;

  @ApiPropertyOptional({ description: 'Dwelling ID' })
  @IsInt()
  @IsOptional()
  dwellingId?: number;

  @ApiProperty({ description: 'User ID' })
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'Company ID' })
  @IsString()
  companyId: string;

  @ApiPropertyOptional({ description: 'Responsible User ID' })
  @IsInt()
  @IsOptional()
  responsibleUserId?: number;
}
