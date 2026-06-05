import { ApiProperty } from '@nestjs/swagger';

export class PassportStatsDto {
  @ApiProperty({ example: 8, description: 'Employees with passport expiry recorded' })
  withPassport: number;

  @ApiProperty({ example: 4, description: 'Employees without passport expiry recorded' })
  withoutPassport: number;
}

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

  @ApiProperty({ type: PassportStatsDto })
  passportStats: PassportStatsDto;
}
