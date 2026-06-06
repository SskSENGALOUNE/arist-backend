import type {
  FooterLink,
  SiteSettingData,
} from './site-setting.repository';

/**
 * Default settings returned when no row has been saved yet, so the public
 * endpoint and the admin form always have a well-formed shape to render.
 */
export const DEFAULT_SITE_SETTING: Omit<
  SiteSettingData,
  'id' | 'createdAt' | 'updatedAt' | 'updatedBy'
> = {
  logoUrl: null,
  brandName: null,
  description: null,
  footerText: null,
  linksHeading: null,
  footerLinks: [],
  contactEmail: null,
  contactPhone: null,
  contactAddress: null,
  facebookUrl: null,
  instagramUrl: null,
  whatsappUrl: null,
  linkedinUrl: null,
  timezone: 'Asia/Vientiane',
  dateFormat: 'DD/MM/YYYY',
  primaryColor: null,
};

export class SiteSetting {
  /**
   * Builds the persistence payload for an update, dropping keys that were not
   * provided so a partial PATCH only touches the fields it carries.
   */
  static buildUpdate(
    props: {
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
    },
    updatedBy: string,
  ) {
    return {
      ...(props.logoUrl !== undefined ? { logoUrl: props.logoUrl } : {}),
      ...(props.brandName !== undefined ? { brandName: props.brandName } : {}),
      ...(props.description !== undefined
        ? { description: props.description }
        : {}),
      ...(props.footerText !== undefined
        ? { footerText: props.footerText }
        : {}),
      ...(props.linksHeading !== undefined
        ? { linksHeading: props.linksHeading }
        : {}),
      ...(props.footerLinks !== undefined
        ? { footerLinks: props.footerLinks }
        : {}),
      ...(props.contactEmail !== undefined
        ? { contactEmail: props.contactEmail }
        : {}),
      ...(props.contactPhone !== undefined
        ? { contactPhone: props.contactPhone }
        : {}),
      ...(props.contactAddress !== undefined
        ? { contactAddress: props.contactAddress }
        : {}),
      ...(props.facebookUrl !== undefined
        ? { facebookUrl: props.facebookUrl }
        : {}),
      ...(props.instagramUrl !== undefined
        ? { instagramUrl: props.instagramUrl }
        : {}),
      ...(props.whatsappUrl !== undefined
        ? { whatsappUrl: props.whatsappUrl }
        : {}),
      ...(props.linkedinUrl !== undefined
        ? { linkedinUrl: props.linkedinUrl }
        : {}),
      ...(props.timezone !== undefined ? { timezone: props.timezone } : {}),
      ...(props.dateFormat !== undefined ? { dateFormat: props.dateFormat } : {}),
      ...(props.primaryColor !== undefined
        ? { primaryColor: props.primaryColor }
        : {}),
      updatedBy,
    };
  }
}
