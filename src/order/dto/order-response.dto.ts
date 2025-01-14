import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { Order, OrderResponse } from 'src/common/interfaces/order';
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

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: 'RECEIVED' })
  @Expose()
  status: string;

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
}
