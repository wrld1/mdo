import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AclResponse } from 'src/common/interfaces/acl';

@Exclude()
export class AclResponseDto implements AclResponse {
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
