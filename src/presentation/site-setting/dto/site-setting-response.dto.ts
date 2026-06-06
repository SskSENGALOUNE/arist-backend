import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FooterLinkDto } from './update-site-setting.dto';

export class SiteSettingResponseDto {
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000001' })
  id: string;

  @ApiPropertyOptional({ nullable: true })
  logoUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  brandName: string | null;

  @ApiPropertyOptional({ nullable: true })
  description: string | null;

  @ApiPropertyOptional({ nullable: true })
  footerText: string | null;

  @ApiPropertyOptional({ nullable: true })
  linksHeading: string | null;

  @ApiProperty({ type: [FooterLinkDto] })
  footerLinks: FooterLinkDto[];

  @ApiPropertyOptional({ nullable: true })
  contactEmail: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactPhone: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactAddress: string | null;

  @ApiPropertyOptional({ nullable: true })
  facebookUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  instagramUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  whatsappUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  linkedinUrl: string | null;

  @ApiProperty({ example: 'Asia/Vientiane' })
  timezone: string;

  @ApiProperty({ example: 'DD/MM/YYYY' })
  dateFormat: string;

  @ApiPropertyOptional({ nullable: true, example: '#0284c7' })
  primaryColor: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  updatedBy: string;
}
