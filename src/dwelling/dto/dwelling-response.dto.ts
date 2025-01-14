import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { ObjectResponseDto } from 'src/object/dto/object-response.dto';
import { DwellingResponse } from 'src/common/interfaces/dwelling';

@Exclude()
export class DwellingResponseDto implements DwellingResponse {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Apartment 101' })
  name: string;

  @Expose()
  @ApiProperty({ example: '2B' })
  number: string;

  @Expose()
  @ApiProperty({ example: 75.5 })
  area: number;

  @Expose()
  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  updatedAt: Date;

  @Expose()
  @Type(() => UserResponseDto)
  @ApiProperty({
    type: UserResponseDto,
    example: {
      id: 1,
      name: 'John Doe',
    },
  })
  user?: UserResponseDto;

  @Expose()
  @Type(() => ObjectResponseDto)
  @ApiProperty({
    type: ObjectResponseDto,
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Building A',
    },
  })
  object: ObjectResponseDto;
}
