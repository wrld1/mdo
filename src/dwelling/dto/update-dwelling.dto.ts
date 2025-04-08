import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDwellingDto } from './create-dwelling.dto';

export class UpdateDwellingDto extends PartialType(CreateDwellingDto) {
  @ApiProperty({ required: false })
  services?: any;
}
