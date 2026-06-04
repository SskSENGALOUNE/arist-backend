import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetSiteSettingQuery } from './get-site-setting.query';
import type {
  ISiteSettingRepository,
  SiteSettingData,
} from '../../../domain/site-setting/site-setting.repository';
import {
  SITE_SETTING_REPOSITORY,
  SITE_SETTING_SINGLETON_ID,
} from '../../../domain/site-setting/site-setting.repository';
import { DEFAULT_SITE_SETTING } from '../../../domain/site-setting/site-setting.entity';

@QueryHandler(GetSiteSettingQuery)
export class GetSiteSettingHandler
  implements IQueryHandler<GetSiteSettingQuery>
{
  constructor(
    @Inject(SITE_SETTING_REPOSITORY)
    private readonly repository: ISiteSettingRepository,
  ) {}

  async execute(): Promise<SiteSettingData> {
    const existing = await this.repository.get();
    if (existing) {
      return existing;
    }

    // Never saved yet — return a well-formed default so clients can render.
    const now = new Date();
    return {
      id: SITE_SETTING_SINGLETON_ID,
      ...DEFAULT_SITE_SETTING,
      createdAt: now,
      updatedAt: now,
      updatedBy: '',
    };
  }
}
