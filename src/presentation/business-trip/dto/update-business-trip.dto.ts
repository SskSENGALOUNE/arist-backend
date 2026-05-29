import { ApiPropertyOptional } from '@nestjs/swagger';
import { Country, LaoProvince, TripType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateBusinessTripDto {
  @ApiPropertyOptional({ example: 'Site visit at Luang Prabang branch' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ enum: TripType })
  @IsOptional()
  @IsEnum(TripType)
  tripType?: TripType;

  @ApiPropertyOptional({ enum: LaoProvince, nullable: true })
  @IsOptional()
  @IsEnum(LaoProvince)
  destinationProvince?: LaoProvince | null;

  @ApiPropertyOptional({ enum: Country, nullable: true })
  @IsOptional()
  @IsEnum(Country)
  destinationCountry?: Country | null;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  departureDate?: Date;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  returnDate?: Date;
}
