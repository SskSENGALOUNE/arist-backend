import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteUserCommand } from './delete-user.command';
import { USER_REPOSITORY } from '../../../domain/user/user.repository';
import type { IUserRepository } from '../../../domain/user/user.repository';
import { NotFoundDomainException } from '../../../domain/exceptions';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler
  implements ICommandHandler<DeleteUserCommand, void>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const existing = await this.userRepo.findById(command.id);
    if (!existing) {
      throw NotFoundDomainException.forResource('User', command.id);
    }
    await this.userRepo.delete(command.id);
  }
}
