import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import {
  ISiteSettingRepository,
  SiteSettingData,
  UpdateSiteSettingData,
  FooterLink,
  SITE_SETTING_SINGLETON_ID,
} from '../../../domain/site-setting/site-setting.repository';

type SiteSettingRow = {
  id: string;
  logoUrl: string | null;
  brandName: string | null;
  description: string | null;
  footerText: string | null;
  linksHeading: string | null;
  footerLinks: Prisma.JsonValue;
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  whatsappUrl: string | null;
  linkedinUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
};

@Injectable()
export class SiteSettingRepositoryImpl implements ISiteSettingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<SiteSettingData | null> {
    const row = await this.prisma.siteSetting.findUnique({
      where: { id: SITE_SETTING_SINGLETON_ID },
    });
    return row ? this.toData(row) : null;
  }

  async upsert(data: UpdateSiteSettingData): Promise<SiteSettingData> {
    const { updatedBy, footerLinks, ...rest } = data;
    const links =
      footerLinks !== undefined
        ? (footerLinks as unknown as Prisma.InputJsonValue)
        : undefined;

    const row = await this.prisma.siteSetting.upsert({
      where: { id: SITE_SETTING_SINGLETON_ID },
      create: {
        id: SITE_SETTING_SINGLETON_ID,
        logoUrl: rest.logoUrl ?? null,
        brandName: rest.brandName ?? null,
        description: rest.description ?? null,
        footerText: rest.footerText ?? null,
        linksHeading: rest.linksHeading ?? null,
        footerLinks: links ?? [],
        contactEmail: rest.contactEmail ?? null,
        contactPhone: rest.contactPhone ?? null,
        contactAddress: rest.contactAddress ?? null,
        facebookUrl: rest.facebookUrl ?? null,
        instagramUrl: rest.instagramUrl ?? null,
        whatsappUrl: rest.whatsappUrl ?? null,
        linkedinUrl: rest.linkedinUrl ?? null,
        updatedBy,
      },
      update: {
        ...rest,
        ...(links !== undefined ? { footerLinks: links } : {}),
        updatedBy,
      },
    });
    return this.toData(row);
  }

  private toData(row: SiteSettingRow): SiteSettingData {
    return {
      id: row.id,
      logoUrl: row.logoUrl,
      brandName: row.brandName,
      description: row.description,
      footerText: row.footerText,
      linksHeading: row.linksHeading,
      footerLinks: Array.isArray(row.footerLinks)
        ? (row.footerLinks as unknown as FooterLink[])
        : [],
      contactEmail: row.contactEmail,
      contactPhone: row.contactPhone,
      contactAddress: row.contactAddress,
      facebookUrl: row.facebookUrl,
      instagramUrl: row.instagramUrl,
      whatsappUrl: row.whatsappUrl,
      linkedinUrl: row.linkedinUrl,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      updatedBy: row.updatedBy,
    };
  }
}
