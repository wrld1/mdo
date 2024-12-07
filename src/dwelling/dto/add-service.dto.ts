import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AddServiceDto {
  @ApiProperty({ example: 1, description: 'ID of the service to add' })
  @IsInt()
  @IsNotEmpty()
  serviceId: number;
}
