import { ApiProperty } from '@nestjs/swagger';

export class DestinationStatDto {
  @ApiProperty({ example: 'VIETNAM' })
  name: string;

  @ApiProperty({ example: 7 })
  count: number;
}

export class DestinationStatsResponseDto {
  @ApiProperty({ type: [DestinationStatDto] })
  topCountries: DestinationStatDto[];

  @ApiProperty({ type: [DestinationStatDto] })
  topProvinces: DestinationStatDto[];
}
