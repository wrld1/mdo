import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AssignUserDto {
  @ApiProperty({
    description: 'The ID of the user to assign to the dwelling',
    example: 1,
  })
  @IsNumber()
  userId: number;
}
