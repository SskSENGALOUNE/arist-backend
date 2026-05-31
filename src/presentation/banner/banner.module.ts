import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AdminBannerController } from './admin-banner.controller';
import { BannerController } from './banner.controller';
import { ApplicationModule } from '../../application/application.module';

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [AdminBannerController, BannerController],
})
export class BannerModule {}
