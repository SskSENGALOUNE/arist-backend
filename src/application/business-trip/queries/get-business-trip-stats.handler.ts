import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetBusinessTripStatsQuery } from './get-business-trip-stats.query';
import {
  BUSINESS_TRIP_REPOSITORY,
  type IBusinessTripRepository,
  type TripStats,
} from '../../../domain/business-trip/business-trip.repository';
import {
  USER_REPOSITORY,
  type IUserRepository,
  type PassportStats,
} from '../../../domain/user/user.repository';

export type TripStatsResult = TripStats & { passportStats: PassportStats };

@QueryHandler(GetBusinessTripStatsQuery)
export class GetBusinessTripStatsHandler
  implements IQueryHandler<GetBusinessTripStatsQuery>
{
  constructor(
    @Inject(BUSINESS_TRIP_REPOSITORY)
    private readonly repository: IBusinessTripRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<TripStatsResult> {
    const [tripStats, passportStats] = await Promise.all([
      this.repository.getStats(),
      this.userRepository.getPassportStats(),
    ]);
    return { ...tripStats, passportStats };
  }
}
