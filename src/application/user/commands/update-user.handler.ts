import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateUserCommand } from './update-user.command';
import { USER_REPOSITORY } from '../../../domain/user/user.repository';
import type {
  IUserRepository,
  UserData,
} from '../../../domain/user/user.repository';
import {
  ConflictDomainException,
  NotFoundDomainException,
} from '../../../domain/exceptions';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler
  implements ICommandHandler<UpdateUserCommand, UserData>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserData> {
    const existing = await this.userRepo.findById(command.id);
    if (!existing) {
      throw NotFoundDomainException.forResource('User', command.id);
    }

    if (command.data.email && command.data.email !== existing.email) {
      const duplicate = await this.userRepo.findByEmail(command.data.email);
      if (duplicate && duplicate.id !== command.id) {
        throw new ConflictDomainException('Email already exists');
      }
    }

    return this.userRepo.update(command.id, {
      ...command.data,
      updatedBy: command.updatedBy,
    });
  }
}
