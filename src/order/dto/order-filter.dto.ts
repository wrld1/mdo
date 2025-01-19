import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderType } from '@prisma/client';

export class OrderFilterDto {
  @ApiPropertyOptional({
    enum: OrderType,
    description: 'Filter orders by type',
    default: undefined,
  })
  @IsEnum(OrderType)
  @IsOptional()
  orderType?: OrderType;
}
