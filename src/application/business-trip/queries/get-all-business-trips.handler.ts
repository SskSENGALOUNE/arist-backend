import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllBusinessTripsQuery } from './get-all-business-trips.query';
import {
  BUSINESS_TRIP_REPOSITORY,
  type IBusinessTripRepository,
  type BusinessTripData,
  type PaginatedResult,
} from '../../../domain/business-trip/business-trip.repository';

@QueryHandler(GetAllBusinessTripsQuery)
export class GetAllBusinessTripsHandler
  implements IQueryHandler<GetAllBusinessTripsQuery>
{
  constructor(
    @Inject(BUSINESS_TRIP_REPOSITORY)
    private readonly repository: IBusinessTripRepository,
  ) {}

  async execute(
    query: GetAllBusinessTripsQuery,
  ): Promise<PaginatedResult<BusinessTripData>> {
    return this.repository.findAll({
      skip: query.skip,
      take: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
  }
}
