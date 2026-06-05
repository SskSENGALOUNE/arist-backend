import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TripType } from '@prisma/client';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class TopTravelersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: TripType,
    description: 'Filter by trip type (omit for all trips)',
  })
  @IsOptional()
  @IsEnum(TripType)
  tripType?: TripType;
}
