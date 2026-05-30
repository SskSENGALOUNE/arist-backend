import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AdminBannerController } from './admin-banner.controller';
import { BannerController } from './banner.controller';
import { ApplicationModule } from '../../application/application.module';
import {
  CreateBannerHandler,
  UpdateBannerHandler,
  DeleteBannerHandler,
} from '../../application/banner/commands';
import {
  GetBannerByIdHandler,
  GetAllBannersHandler,
  GetActiveBannersHandler,
} from '../../application/banner/queries';

const CommandHandlers = [
  CreateBannerHandler,
  UpdateBannerHandler,
  DeleteBannerHandler,
];

const QueryHandlers = [
  GetBannerByIdHandler,
  GetAllBannersHandler,
  GetActiveBannersHandler,
];

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [AdminBannerController, BannerController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class BannerModule {}
