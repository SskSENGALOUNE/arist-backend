import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateSiteSettingCommand } from './update-site-setting.command';
import type {
  ISiteSettingRepository,
  SiteSettingData,
} from '../../../domain/site-setting/site-setting.repository';
import { SITE_SETTING_REPOSITORY } from '../../../domain/site-setting/site-setting.repository';
import { SiteSetting } from '../../../domain/site-setting/site-setting.entity';

@CommandHandler(UpdateSiteSettingCommand)
export class UpdateSiteSettingHandler
  implements ICommandHandler<UpdateSiteSettingCommand>
{
  constructor(
    @Inject(SITE_SETTING_REPOSITORY)
    private readonly repository: ISiteSettingRepository,
  ) {}

  async execute(
    command: UpdateSiteSettingCommand,
  ): Promise<SiteSettingData> {
    const updateData = SiteSetting.buildUpdate(
      command.payload,
      command.updatedBy,
    );

    return this.repository.upsert(updateData);
  }
}
