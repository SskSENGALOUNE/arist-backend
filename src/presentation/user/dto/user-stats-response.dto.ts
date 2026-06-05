import { ApiProperty } from '@nestjs/swagger';

export class UserStatsResponseDto {
  @ApiProperty({ example: 4, description: 'Total users' })
  total: number;

  @ApiProperty({ example: 3, description: 'Active users' })
  active: number;

  @ApiProperty({ example: 1, description: 'Inactive users' })
  inactive: number;

  @ApiProperty({ example: 2, description: 'Users with the ADMIN role' })
  admins: number;
}
