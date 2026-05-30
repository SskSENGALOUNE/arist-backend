import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() username: string;
  @ApiProperty() email: string;
  @ApiProperty() role: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty() mustChangePassword: boolean;
  @ApiPropertyOptional() lastLoginAt?: Date | null;

  @ApiPropertyOptional() photoUrl?: string | null;
  @ApiPropertyOptional() gender?: string | null;
  @ApiPropertyOptional() educationLevel?: string | null;
  @ApiPropertyOptional() institutionName?: string | null;
  @ApiPropertyOptional() graduatedFrom?: string | null;
  @ApiPropertyOptional() graduatedCountry?: string | null;
  @ApiPropertyOptional() fieldOfStudy?: string | null;
  @ApiPropertyOptional() englishLevel?: string | null;
  @ApiPropertyOptional() vietnameseLevel?: string | null;
  @ApiPropertyOptional() chineseLevel?: string | null;
  @ApiPropertyOptional() otherLanguages?: string | null;
  @ApiPropertyOptional() passportExpiry?: Date | null;

  @ApiPropertyOptional() departmentId?: string | null;
  @ApiPropertyOptional() positionId?: string | null;

  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}
