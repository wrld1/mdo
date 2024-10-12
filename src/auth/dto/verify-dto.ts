import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyDto {
  @ApiProperty({
    description: 'The token used for verification',
    example: 'your-verification-jwt-token',
  })
  @IsString()
  token: string;
}
