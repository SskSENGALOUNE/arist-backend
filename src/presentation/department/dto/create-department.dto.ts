import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Engineering' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;
}
