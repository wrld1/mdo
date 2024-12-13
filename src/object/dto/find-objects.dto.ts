import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindObjectsDto {
  @ApiPropertyOptional({ example: 'uuid-string' })
  @IsOptional()
  @IsString()
  companyId?: string;
}
