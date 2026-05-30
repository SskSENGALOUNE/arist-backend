import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DepartmentResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
  @ApiPropertyOptional() createdBy?: string | null;
  @ApiPropertyOptional() updatedBy?: string | null;
}
