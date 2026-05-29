import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetBusinessTripByIdQuery } from './get-business-trip-by-id.query';
import {
  BUSINESS_TRIP_REPOSITORY,
  type IBusinessTripRepository,
} from '../../../domain/business-trip/business-trip.repository';
import { NotFoundDomainException } from '../../../domain/exceptions';

@QueryHandler(GetBusinessTripByIdQuery)
export class GetBusinessTripByIdHandler
  implements IQueryHandler<GetBusinessTripByIdQuery>
{
  constructor(
    @Inject(BUSINESS_TRIP_REPOSITORY)
    private readonly repository: IBusinessTripRepository,
  ) {}

  async execute(query: GetBusinessTripByIdQuery) {
    const trip = await this.repository.findById(query.id);
    if (!trip) {
      throw NotFoundDomainException.forResource('BusinessTrip', query.id);
    }
    return trip;
  }
}
