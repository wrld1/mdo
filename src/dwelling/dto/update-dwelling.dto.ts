import { PartialType } from '@nestjs/swagger';
import { CreateDwellingDto } from './create-dwelling.dto';

export class UpdateDwellingDto extends PartialType(CreateDwellingDto) {}
