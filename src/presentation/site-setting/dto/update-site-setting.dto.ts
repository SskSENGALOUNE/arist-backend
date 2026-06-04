import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FooterLinkDto {
  @ApiProperty({ description: 'Link label', example: 'Privacy Policy' })
  @IsString()
  @MaxLength(120)
  label: string;

  @ApiProperty({ description: 'Link URL', example: 'https://example.com/privacy' })
  @IsString()
  @MaxLength(2048)
  url: string;
}

export class UpdateSiteSettingDto {
  @ApiPropertyOptional({
    description: 'Public URL of the site logo',
    nullable: true,
  })
  @IsOptional()
  @IsUrl({ require_tld: false })
  logoUrl?: string | null;

  @ApiPropertyOptional({ description: 'Brand / site name', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  brandName?: string | null;

  @ApiPropertyOptional({
    description: 'Company description / address shown in the footer',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null;

  @ApiPropertyOptional({
    description: 'Footer text / copyright line',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  footerText?: string | null;

  @ApiPropertyOptional({
    description: 'Heading shown above the footer links column',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  linksHeading?: string | null;

  @ApiPropertyOptional({ type: [FooterLinkDto], description: 'Footer links' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FooterLinkDto)
  footerLinks?: FooterLinkDto[];

  @ApiPropertyOptional({ description: 'Contact email', nullable: true })
  @IsOptional()
  @IsEmail()
  contactEmail?: string | null;

  @ApiPropertyOptional({ description: 'Contact phone', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  contactPhone?: string | null;

  @ApiPropertyOptional({ description: 'Contact address', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  contactAddress?: string | null;

  @ApiPropertyOptional({ description: 'Facebook URL', nullable: true })
  @IsOptional()
  @IsUrl({ require_tld: false })
  facebookUrl?: string | null;

  @ApiPropertyOptional({ description: 'Instagram URL', nullable: true })
  @IsOptional()
  @IsUrl({ require_tld: false })
  instagramUrl?: string | null;

  @ApiPropertyOptional({ description: 'WhatsApp URL', nullable: true })
  @IsOptional()
  @IsUrl({ require_tld: false })
  whatsappUrl?: string | null;

  @ApiPropertyOptional({ description: 'LinkedIn URL', nullable: true })
  @IsOptional()
  @IsUrl({ require_tld: false })
  linkedinUrl?: string | null;
}
