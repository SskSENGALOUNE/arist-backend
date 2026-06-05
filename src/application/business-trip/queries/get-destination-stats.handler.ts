import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetDestinationStatsQuery } from './get-destination-stats.query';
import {
  BUSINESS_TRIP_REPOSITORY,
  type IBusinessTripRepository,
  type DestinationStats,
} from '../../../domain/business-trip/business-trip.repository';

@QueryHandler(GetDestinationStatsQuery)
export class GetDestinationStatsHandler
  implements IQueryHandler<GetDestinationStatsQuery>
{
  constructor(
    @Inject(BUSINESS_TRIP_REPOSITORY)
    private readonly repository: IBusinessTripRepository,
  ) {}

  async execute(query: GetDestinationStatsQuery): Promise<DestinationStats> {
    return this.repository.getDestinationStats(query.limit);
  }
}
