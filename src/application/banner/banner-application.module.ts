import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BannerInfrastructureModule } from '../../infrastructure/banner/banner-infrastructure.module';
import {
  CreateBannerHandler,
  UpdateBannerHandler,
  DeleteBannerHandler,
} from './commands';
import {
  GetBannerByIdHandler,
  GetAllBannersHandler,
  GetActiveBannersHandler,
} from './queries';

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
  imports: [CqrsModule, BannerInfrastructureModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [CqrsModule, BannerInfrastructureModule],
})
export class BannerApplicationModule {}
