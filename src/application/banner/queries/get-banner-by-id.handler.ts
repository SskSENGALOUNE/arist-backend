import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetBannerByIdQuery } from './get-banner-by-id.query';
import type { IBannerRepository } from '../../../domain/banner/banner.repository';
import { BANNER_REPOSITORY } from '../../../domain/banner/banner.repository';
import { NotFoundDomainException } from '../../../domain/exceptions';

@QueryHandler(GetBannerByIdQuery)
export class GetBannerByIdHandler
  implements IQueryHandler<GetBannerByIdQuery>
{
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly repository: IBannerRepository,
  ) {}

  async execute(query: GetBannerByIdQuery) {
    const result = await this.repository.findById(query.id);

    if (!result) {
      throw NotFoundDomainException.forResource('Banner', query.id);
    }

    return result;
  }
}
