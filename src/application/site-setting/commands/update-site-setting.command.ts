import type { FooterLink } from '../../../domain/site-setting/site-setting.repository';

export interface UpdateSiteSettingPayload {
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
  timezone?: string;
  dateFormat?: string;
  primaryColor?: string | null;
}

export class UpdateSiteSettingCommand {
  constructor(
    public readonly payload: UpdateSiteSettingPayload,
    public readonly updatedBy: string,
  ) {}
}
