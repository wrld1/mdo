import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { OrderUpdate } from 'src/common/interfaces/order';

export class UpdateOrderDto implements OrderUpdate {
  @ApiPropertyOptional({ description: 'Order description' })
  @IsString()
  @MinLength(3)
  description: string;

  @ApiPropertyOptional({ description: 'Responsible User ID' })
  @IsInt()
  @IsOptional()
  responsibleUserId?: number;

  @ApiProperty({ description: 'Order Id' })
  @IsString()
  id: string;

  @ApiPropertyOptional({ description: 'Order price' })
  @IsOptional()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ enum: OrderStatus, description: 'Order status' })
  @IsEnum(OrderStatus)
  @IsOptional()
  orderStatus: OrderStatus;
}
