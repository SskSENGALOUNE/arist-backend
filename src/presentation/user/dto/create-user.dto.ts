import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, UserRole } from '../../../domain/user/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'jdoe' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'jdoe@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty() @IsNotEmpty() @IsString() firstName: string;
  @ApiProperty() @IsNotEmpty() @IsString() lastName: string;

  @ApiProperty({ enum: Gender }) @IsNotEmpty() @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional() @IsOptional() @IsUUID() departmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() positionId?: string;
}
