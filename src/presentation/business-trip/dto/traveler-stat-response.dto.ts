import { ApiProperty } from '@nestjs/swagger';

export class TravelerStatResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ example: 7 })
  tripCount: number;
}
