import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetUserStatsQuery } from './get-user-stats.query';
import type {
  IUserRepository,
  UserStats,
} from '../../../domain/user/user.repository';
import { USER_REPOSITORY } from '../../../domain/user/user.repository';

@QueryHandler(GetUserStatsQuery)
export class GetUserStatsHandler
  implements IQueryHandler<GetUserStatsQuery>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly repository: IUserRepository,
  ) {}

  async execute(): Promise<UserStats> {
    return this.repository.getStats();
  }
}
