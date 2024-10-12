import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

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
}
