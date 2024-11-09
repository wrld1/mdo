import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Exclude()
export class AclResponseDto {
  @ApiProperty({
    description: 'The resource name',
    example: 'companies',
  })
  @Expose()
  resource: string;

  @ApiProperty({
    description: 'The permission level',
    example: 'READ',
    enum: ['READ', 'WRITE'],
  })
  @Expose()
  permission: string;
}
