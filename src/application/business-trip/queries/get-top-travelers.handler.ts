import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTopTravelersQuery } from './get-top-travelers.query';
import {
  BUSINESS_TRIP_REPOSITORY,
  type IBusinessTripRepository,
  type PaginatedResult,
  type TravelerStat,
} from '../../../domain/business-trip/business-trip.repository';

@QueryHandler(GetTopTravelersQuery)
export class GetTopTravelersHandler
  implements IQueryHandler<GetTopTravelersQuery>
{
  constructor(
    @Inject(BUSINESS_TRIP_REPOSITORY)
    private readonly repository: IBusinessTripRepository,
  ) {}

  async execute(
    query: GetTopTravelersQuery,
  ): Promise<PaginatedResult<TravelerStat>> {
    return this.repository.getTopTravelers({
      skip: query.skip,
      take: query.limit,
      tripType: query.tripType,
      month: query.month,
      year: query.year,
    });
  }
}
