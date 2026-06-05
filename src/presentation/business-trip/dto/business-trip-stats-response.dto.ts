import { ApiProperty } from '@nestjs/swagger';

export class BusinessTripStatsResponseDto {
  @ApiProperty({ example: 12 })
  total: number;

  @ApiProperty({ example: 4 })
  pending: number;

  @ApiProperty({ example: 6 })
  verified: number;

  @ApiProperty({ example: 1 })
  rejected: number;

  @ApiProperty({ example: 1 })
  draft: number;
}
