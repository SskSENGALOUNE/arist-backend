import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Country, LaoProvince, TripStatus, TripType } from '@prisma/client';

export class BusinessTripResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: TripType })
  tripType: TripType;

  @ApiPropertyOptional({ enum: LaoProvince, nullable: true })
  destinationProvince: LaoProvince | null;

  @ApiPropertyOptional({ enum: Country, nullable: true })
  destinationCountry: Country | null;

  @ApiProperty({ format: 'date' })
  departureDate: Date;

  @ApiProperty({ format: 'date' })
  returnDate: Date;

  @ApiProperty({ enum: TripStatus })
  status: TripStatus;

  @ApiPropertyOptional({ nullable: true })
  submittedAt: Date | null;

  @ApiPropertyOptional({ nullable: true })
  verifiedAt: Date | null;

  @ApiPropertyOptional({ nullable: true })
  verifiedById: string | null;

  @ApiPropertyOptional({ nullable: true })
  rejectionReason: string | null;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
