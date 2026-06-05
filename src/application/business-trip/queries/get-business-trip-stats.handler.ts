import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetBusinessTripStatsQuery } from './get-business-trip-stats.query';
import {
  BUSINESS_TRIP_REPOSITORY,
  type IBusinessTripRepository,
  type TripStats,
} from '../../../domain/business-trip/business-trip.repository';

@QueryHandler(GetBusinessTripStatsQuery)
export class GetBusinessTripStatsHandler
  implements IQueryHandler<GetBusinessTripStatsQuery>
{
  constructor(
    @Inject(BUSINESS_TRIP_REPOSITORY)
    private readonly repository: IBusinessTripRepository,
  ) {}

  async execute(): Promise<TripStats> {
    return this.repository.getStats();
  }
}
