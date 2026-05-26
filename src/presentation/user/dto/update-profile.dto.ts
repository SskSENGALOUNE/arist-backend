import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  Country,
  EducationLevel,
  Gender,
  GraduatedFrom,
  LanguageLevel,
} from '../../../domain/user/user.entity';

export class UpdateProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() photoUrl?: string;

  @ApiPropertyOptional({ enum: Gender }) @IsOptional() @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ enum: EducationLevel }) @IsOptional() @IsEnum(EducationLevel)
  educationLevel?: EducationLevel;

  @ApiPropertyOptional() @IsOptional() @IsString() institutionName?: string;

  @ApiPropertyOptional({ enum: GraduatedFrom }) @IsOptional() @IsEnum(GraduatedFrom)
  graduatedFrom?: GraduatedFrom;

  @ApiPropertyOptional({ enum: Country }) @IsOptional() @IsEnum(Country)
  graduatedCountry?: Country;

  @ApiPropertyOptional() @IsOptional() @IsString() fieldOfStudy?: string;

  @ApiPropertyOptional({ enum: LanguageLevel }) @IsOptional() @IsEnum(LanguageLevel)
  englishLevel?: LanguageLevel;

  @ApiPropertyOptional({ enum: LanguageLevel }) @IsOptional() @IsEnum(LanguageLevel)
  vietnameseLevel?: LanguageLevel;

  @ApiPropertyOptional({ enum: LanguageLevel }) @IsOptional() @IsEnum(LanguageLevel)
  chineseLevel?: LanguageLevel;

  @ApiPropertyOptional() @IsOptional() @IsString() otherLanguages?: string;

  @ApiPropertyOptional({ example: '2030-12-31' })
  @IsOptional()
  @IsDateString()
  passportExpiry?: string;
}
