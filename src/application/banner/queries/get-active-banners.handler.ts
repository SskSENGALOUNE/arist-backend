import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetActiveBannersQuery } from './get-active-banners.query';
import type {
  IBannerRepository,
  BannerData,
} from '../../../domain/banner/banner.repository';
import { BANNER_REPOSITORY } from '../../../domain/banner/banner.repository';

@QueryHandler(GetActiveBannersQuery)
export class GetActiveBannersHandler
  implements IQueryHandler<GetActiveBannersQuery>
{
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly repository: IBannerRepository,
  ) {}

  async execute(): Promise<BannerData[]> {
    return this.repository.findActive();
  }
}
