/** The site settings table holds exactly one row, identified by this id. */
export const SITE_SETTING_SINGLETON_ID =
  '00000000-0000-0000-0000-000000000001';

export interface FooterLink {
  label: string;
  url: string;
}

export interface SiteSettingData {
  id: string;
  logoUrl: string | null;
  brandName: string | null;
  description: string | null;
  footerText: string | null;
  linksHeading: string | null;
  footerLinks: FooterLink[];
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
}

export interface UpdateSiteSettingData {
  logoUrl?: string | null;
  brandName?: string | null;
  description?: string | null;
  footerText?: string | null;
  linksHeading?: string | null;
  footerLinks?: FooterLink[];
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactAddress?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  whatsappUrl?: string | null;
  linkedinUrl?: string | null;
  updatedBy: string;
}

export interface ISiteSettingRepository {
  /** Returns the singleton settings row, or null if it has never been saved. */
  get(): Promise<SiteSettingData | null>;
  /** Creates or updates the singleton settings row. */
  upsert(data: UpdateSiteSettingData): Promise<SiteSettingData>;
}

export const SITE_SETTING_REPOSITORY = Symbol('SITE_SETTING_REPOSITORY');
