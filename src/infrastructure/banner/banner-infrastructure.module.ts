import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BannerRepositoryImpl } from '../prisma/repositories/banner.repository.impl';
import { BANNER_REPOSITORY } from '../../domain/banner/banner.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: BANNER_REPOSITORY,
      useClass: BannerRepositoryImpl,
    },
  ],
  exports: [BANNER_REPOSITORY],
})
export class BannerInfrastructureModule {}
