import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { FraudStatus } from '@prisma/client';
import { AclResponseDto } from 'src/acl/dto/acl-response.dto';

@Exclude()
export class UserResponseDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Indicates whether the user is verified',
    example: true,
  })
  @Expose()
  isVerified: boolean;

  @ApiProperty({
    description: 'User fraud status',
    enum: FraudStatus,
    example: FraudStatus.CLEAR,
  })
  @Expose()
  fraudStatus: FraudStatus;

  @ApiProperty({
    description: 'User access control list',
    type: [AclResponseDto],
  })
  @Expose()
  @Type(() => AclResponseDto)
  Acl: AclResponseDto[];
}
