import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Country, LaoProvince, TripType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateBusinessTripDto {
  @ApiProperty({ example: 'Site visit at Luang Prabang branch' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ enum: TripType, example: TripType.DOMESTIC })
  @IsEnum(TripType)
  tripType: TripType;

  @ApiPropertyOptional({
    enum: LaoProvince,
    description: 'Required when tripType is DOMESTIC',
  })
  @IsOptional()
  @IsEnum(LaoProvince)
  destinationProvince?: LaoProvince;

  @ApiPropertyOptional({
    enum: Country,
    description: 'Required when tripType is INTERNATIONAL',
  })
  @IsOptional()
  @IsEnum(Country)
  destinationCountry?: Country;

  @ApiProperty({ example: '2026-06-01', format: 'date' })
  @Type(() => Date)
  @IsDate()
  departureDate: Date;

  @ApiProperty({ example: '2026-06-05', format: 'date' })
  @Type(() => Date)
  @IsDate()
  returnDate: Date;
}
