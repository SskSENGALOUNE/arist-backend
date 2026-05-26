import { ApiProperty } from '@nestjs/swagger';

export class AuthUserResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() username: string;
  @ApiProperty() email: string;
  @ApiProperty() role: string;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty() mustChangePassword: boolean;
}

export class LoginResponseDto {
  @ApiProperty() accessToken: string;
  @ApiProperty() refreshToken: string;
  @ApiProperty() accessTokenExpiresAt: Date;
  @ApiProperty() refreshTokenExpiresAt: Date;
  @ApiProperty({ type: AuthUserResponseDto }) user: AuthUserResponseDto;
}

export class RefreshResponseDto {
  @ApiProperty() accessToken: string;
  @ApiProperty() refreshToken: string;
  @ApiProperty() accessTokenExpiresAt: Date;
  @ApiProperty() refreshTokenExpiresAt: Date;
}
