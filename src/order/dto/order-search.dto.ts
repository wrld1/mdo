import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OrderSearchParamsDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  orderSearch?: string | null;
}
