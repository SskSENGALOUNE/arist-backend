import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListUsersQuery } from './list-users.query';
import { USER_REPOSITORY } from '../../../domain/user/user.repository';
import type {
  IUserRepository,
  PaginatedUsers,
} from '../../../domain/user/user.repository';

@QueryHandler(ListUsersQuery)
export class ListUsersHandler
  implements IQueryHandler<ListUsersQuery, PaginatedUsers>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(query: ListUsersQuery): Promise<PaginatedUsers> {
    return this.userRepo.findPaginated({
      skip: query.skip,
      take: query.limit,
      role: query.role,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
  }
}
