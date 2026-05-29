import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CompleteInitialPasswordCommand } from './complete-initial-password.command';
import { USER_REPOSITORY } from '../../../domain/user/user.repository';
import type { IUserRepository } from '../../../domain/user/user.repository';
import { REFRESH_TOKEN_REPOSITORY } from '../../../domain/user/refresh-token.repository';
import type { IRefreshTokenRepository } from '../../../domain/user/refresh-token.repository';
import { PASSWORD_HASHER } from '../../../domain/user/password-hasher.port';
import type { IPasswordHasher } from '../../../domain/user/password-hasher.port';
import {
  NotFoundDomainException,
  UnauthorizedDomainException,
  DomainValidationException,
} from '../../../domain/exceptions';

@CommandHandler(CompleteInitialPasswordCommand)
export class CompleteInitialPasswordHandler
  implements ICommandHandler<CompleteInitialPasswordCommand, void>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshRepo: IRefreshTokenRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: IPasswordHasher,
  ) {}

  async execute(command: CompleteInitialPasswordCommand): Promise<void> {
    const user = await this.userRepo.findByIdWithPassword(command.userId);
    if (!user) {
      throw NotFoundDomainException.forResource('User', command.userId);
    }

    if (!user.mustChangePassword) {
      throw new UnauthorizedDomainException(
        'Password change is not required for this account',
      );
    }

    const sameAsOld = await this.hasher.compare(
      command.newPassword,
      user.password,
    );
    if (sameAsOld) {
      throw new DomainValidationException(
        'New password must differ from current password',
      );
    }

    const hashed = await this.hasher.hash(command.newPassword);
    await this.userRepo.updatePassword(user.id, hashed, false);
    await this.refreshRepo.revokeAllByUserId(user.id);
  }
}
