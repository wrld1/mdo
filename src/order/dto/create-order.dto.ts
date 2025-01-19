import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, OrderType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Order } from 'src/common/interfaces/order';

export class CreateOrderDto implements Order {
  @ApiProperty({ description: 'Order name' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ enum: OrderType, description: 'Order type' })
  @IsEnum(OrderType)
  type: OrderType;

  @ApiProperty({ description: 'Order description' })
  @IsString()
  @MinLength(3)
  description: string;

  @ApiProperty({ description: 'Object connection' })
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

  @ApiPropertyOptional({ description: 'Order price' })
  @IsDecimal()
  @IsOptional()
  price?: Decimal;

  @ApiProperty({ enum: OrderStatus, description: 'Order status' })
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;
}
