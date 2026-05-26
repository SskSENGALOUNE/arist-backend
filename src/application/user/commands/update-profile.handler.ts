import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateProfileCommand } from './update-profile.command';
import { USER_REPOSITORY } from '../../../domain/user/user.repository';
import type {
  IUserRepository,
  UserData,
} from '../../../domain/user/user.repository';
import { NotFoundDomainException } from '../../../domain/exceptions';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler
  implements ICommandHandler<UpdateProfileCommand, UserData>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<UserData> {
    const existing = await this.userRepo.findById(command.userId);
    if (!existing) {
      throw NotFoundDomainException.forResource('User', command.userId);
    }

    return this.userRepo.updateProfile(command.userId, {
      ...command.data,
      updatedBy: command.userId,
    });
  }
}
