import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { USER_REPOSITORY } from '../../../domain/user/user.repository';
import type {
  IUserRepository,
  UserData,
} from '../../../domain/user/user.repository';
import { NotFoundDomainException } from '../../../domain/exceptions';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler
  implements IQueryHandler<GetUserByIdQuery, UserData>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<UserData> {
    const user = await this.userRepo.findById(query.id);
    if (!user) {
      throw NotFoundDomainException.forResource('User', query.id);
    }
    return user;
  }
}
