import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, OrderType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { OrderResponse } from 'src/common/interfaces/order';
import { DwellingResponseDto } from 'src/dwelling/dto/dwelling-response.dto';
import { ObjectResponseDto } from 'src/object/dto/object-response.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@Exclude()
export class OrderResponseDto implements OrderResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Order name' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'Order description' })
  @Expose()
  description: string;

  @ApiProperty({
    type: () => ObjectResponseDto,
    description: 'Related object',
    example: {
      id: 'obj-123',
      address: 'вул. Київська, 123',
      type: 'APARTMENT_BUILDING',
    },
  })
  @Expose()
  @Type(() => ObjectResponseDto)
  object: ObjectResponseDto;

  @ApiProperty({
    type: () => DwellingResponseDto,
    description: 'Related dwelling',
    required: false,
    example: {
      id: 1,
      name: 'Квартира 101',
      floor: 1,
    },
  })
  @Expose()
  @Type(() => DwellingResponseDto)
  dwelling?: DwellingResponseDto;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    enum: OrderType,
    example: OrderType.ELECTRICITY,
    description: 'Type of order',
  })
  @Expose()
  type: OrderType;

  @ApiProperty({
    example: {
      id: 1,
      name: 'John Doe',
    },
    type: [UserResponseDto],
  })
  @Expose()
  @Type(() => UserResponseDto)
  responsibleUser?: UserResponseDto;

  @ApiProperty({
    type: () => UserResponseDto,
    example: {
      id: 1,
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      isVerified: true,
    },
  })
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @ApiProperty({
    example: 1000.5,
    description: 'Order price',
    type: Number,
  })
  @Expose()
  @Transform(({ value }) => {
    if (value instanceof Decimal) {
      return value.toNumber();
    }
    return value;
  })
  price?: number;

  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.RECEIVED,
    description: 'Current order status',
  })
  @Expose()
  orderStatus: OrderStatus;
}
