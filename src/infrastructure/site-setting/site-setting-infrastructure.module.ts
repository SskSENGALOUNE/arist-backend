import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SiteSettingRepositoryImpl } from '../prisma/repositories/site-setting.repository.impl';
import { SITE_SETTING_REPOSITORY } from '../../domain/site-setting/site-setting.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: SITE_SETTING_REPOSITORY,
      useClass: SiteSettingRepositoryImpl,
    },
  ],
  exports: [SITE_SETTING_REPOSITORY],
})
export class SiteSettingInfrastructureModule {}
