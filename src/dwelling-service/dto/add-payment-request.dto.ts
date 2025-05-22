import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  ValidateNested,
  ValidateIf,
  IsDefined,
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
  @ValidateIf(
    (o) =>
      !o.dwellingServiceId &&
      (o.dwellingId !== undefined || o.serviceId !== undefined),
  )
  @IsInt()
  dwellingId?: number;

  @ApiPropertyOptional({
    description:
      'ID of the service. Required if dwellingServiceId is not provided.',
    example: 5,
  })
  @ValidateIf(
    (o) =>
      !o.dwellingServiceId &&
      (o.dwellingId !== undefined || o.serviceId !== undefined),
  )
  @IsInt()
  serviceId?: number;

  @ApiProperty({
    type: CreateServicePaymentDto,
    description: 'Payment details to be created.',
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateServicePaymentDto)
  payment: CreateServicePaymentDto;
}
