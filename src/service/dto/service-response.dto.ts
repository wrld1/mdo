import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ObjectResponseDto } from '../../object/dto/object-response.dto';
import { DwellingResponseDto } from '../../dwelling/dto/dwelling-response.dto';
import { ServiceResponse } from 'src/common/interfaces/service';

@Exclude()
export class ServiceResponseDto implements ServiceResponse {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Електроенергія' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'Постачання електроенергії' })
  description: string;

  @Expose()
  @ApiProperty({ example: 100.5 })
  price: number;

  @Expose()
  @ApiProperty({ example: 'https://example.com/logo.png' })
  logo: string;

  @Expose()
  @ApiProperty({ required: false })
  objectId?: string;

  @Expose()
  @Type(() => ObjectResponseDto)
  @ApiProperty({ type: ObjectResponseDto, required: false })
  object?: ObjectResponseDto;

  @Expose()
  @ApiProperty({ required: false })
  dwellingId?: number;

  @Expose()
  @Type(() => DwellingResponseDto)
  @ApiProperty({ type: DwellingResponseDto, required: false })
  dwelling?: DwellingResponseDto;
}
