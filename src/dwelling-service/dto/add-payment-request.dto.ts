import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
  ValidateIf,
} from 'class-validator';
import { CreateServicePaymentDto } from 'src/service-payment/dto/create-service-payment.dto';

export class AddPaymentsRequestDto {
  @ApiPropertyOptional({
    description:
      'ID of the specific DwellingService. If provided, dwellingId and serviceId are ignored.',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  dwellingServiceId?: number;

  @ApiPropertyOptional({
    description:
      'ID of the dwelling. Required if dwellingServiceId is not provided.',
    example: 10,
  })
  @ValidateIf((o) => !o.dwellingServiceId)
  @IsInt()
  dwellingId?: number;

  @ApiPropertyOptional({
    description:
      'ID of the service. Required if dwellingServiceId is not provided.',
    example: 5,
  })
  @ValidateIf((o) => !o.dwellingServiceId)
  @IsInt()
  serviceId?: number;

  @ApiProperty({
    type: [CreateServicePaymentDto],
    description: 'Array of payment details to be created.',
    minItems: 1,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServicePaymentDto)
  @ArrayMinSize(1)
  payments: CreateServicePaymentDto[];
}
