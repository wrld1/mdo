import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindOrdersDto {
  @ApiPropertyOptional({ example: 'uuid-string' })
  @IsOptional()
  @IsString()
  companyId?: string;
}
