import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AdminSiteSettingController } from './admin-site-setting.controller';
import { SiteSettingController } from './site-setting.controller';
import { ApplicationModule } from '../../application/application.module';

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [AdminSiteSettingController, SiteSettingController],
})
export class SiteSettingModule {}
