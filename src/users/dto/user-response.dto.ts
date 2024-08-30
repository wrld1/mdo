import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  email: string;

  @Expose()
  isVerified: boolean;
}
