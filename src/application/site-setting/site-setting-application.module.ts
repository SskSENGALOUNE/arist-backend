import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SiteSettingInfrastructureModule } from '../../infrastructure/site-setting/site-setting-infrastructure.module';
import { UpdateSiteSettingHandler } from './commands';
import { GetSiteSettingHandler } from './queries';

const CommandHandlers = [UpdateSiteSettingHandler];
const QueryHandlers = [GetSiteSettingHandler];

@Module({
  imports: [CqrsModule, SiteSettingInfrastructureModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [CqrsModule, SiteSettingInfrastructureModule],
})
export class SiteSettingApplicationModule {}
