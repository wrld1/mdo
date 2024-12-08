import { IsString, IsOptional } from 'class-validator';
import { Service } from 'src/common/interfaces/service';

export class CreateServiceDto implements Service {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  price: string;

  @IsString()
  logo: string;

  @IsString()
  @IsOptional()
  objectId?: string;
}
