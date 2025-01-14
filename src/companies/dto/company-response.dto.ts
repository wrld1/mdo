import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { ObjectResponseDto } from 'src/object/dto/object-response.dto';
import { CompanyResponse } from 'src/common/interfaces/company';

@Exclude()
export class CompanyResponseDto implements CompanyResponse {
  @Expose()
  @ApiProperty({ example: 'comp-123' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'ЖЕК №1' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'info@zhek1.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: '+380441234567' })
  phone: string;

  @Expose()
  @ApiProperty({ example: 'вул. Шевченка, 1' })
  address: string;

  @Expose()
  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  updatedAt: Date;

  @Expose()
  @Type(() => ObjectResponseDto)
  @ApiProperty({
    type: [ObjectResponseDto],
    required: false,
  })
  objects?: ObjectResponseDto[];

  @Expose()
  @Type(() => UserResponseDto)
  @ApiProperty({
    type: [UserResponseDto],
    required: false,
  })
  users?: UserResponseDto[];
}
