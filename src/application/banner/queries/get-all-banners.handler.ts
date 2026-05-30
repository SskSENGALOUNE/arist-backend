import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllBannersQuery } from './get-all-banners.query';
import type {
  IBannerRepository,
  BannerData,
  PaginatedResult,
} from '../../../domain/banner/banner.repository';
import { BANNER_REPOSITORY } from '../../../domain/banner/banner.repository';

@QueryHandler(GetAllBannersQuery)
export class GetAllBannersHandler
  implements IQueryHandler<GetAllBannersQuery>
{
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly repository: IBannerRepository,
  ) {}

  async execute(
    query: GetAllBannersQuery,
  ): Promise<PaginatedResult<BannerData>> {
    return this.repository.findPaginated({
      skip: query.skip,
      take: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
  }
}
