import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePositionDto {
  @ApiProperty({ example: 'Software Engineer' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;
}
