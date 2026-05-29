import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RejectBusinessTripDto {
  @ApiProperty({
    example: 'Departure date does not match attendance log',
    description: 'Reason why admin rejected this trip',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  rejectionReason: string;
}
