import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../domain/user/user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional({ enum: UserRole }) @IsOptional() @IsEnum(UserRole) role?: UserRole;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() firstName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastName?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() departmentId?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsUUID() positionId?: string | null;
}
