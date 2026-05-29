import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMyBusinessTripsQuery } from './get-my-business-trips.query';
import {
  BUSINESS_TRIP_REPOSITORY,
  type IBusinessTripRepository,
  type BusinessTripData,
  type PaginatedResult,
} from '../../../domain/business-trip/business-trip.repository';

@QueryHandler(GetMyBusinessTripsQuery)
export class GetMyBusinessTripsHandler
  implements IQueryHandler<GetMyBusinessTripsQuery>
{
  constructor(
    @Inject(BUSINESS_TRIP_REPOSITORY)
    private readonly repository: IBusinessTripRepository,
  ) {}

  async execute(
    query: GetMyBusinessTripsQuery,
  ): Promise<PaginatedResult<BusinessTripData>> {
    return this.repository.findByUser(query.userId, {
      skip: query.skip,
      take: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
  }
}
