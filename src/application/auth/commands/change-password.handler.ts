import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ChangePasswordCommand } from './change-password.command';
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

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler
  implements ICommandHandler<ChangePasswordCommand, void>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshRepo: IRefreshTokenRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: IPasswordHasher,
  ) {}

  async execute(command: ChangePasswordCommand): Promise<void> {
    const user = await this.userRepo.findByIdWithPassword(command.userId);
    if (!user) {
      throw NotFoundDomainException.forResource('User', command.userId);
    }

    const valid = await this.hasher.compare(command.currentPassword, user.password);
    if (!valid) {
      throw new UnauthorizedDomainException('Current password is incorrect');
    }

    if (command.currentPassword === command.newPassword) {
      throw new DomainValidationException(
        'New password must differ from current password',
      );
    }

    const hashed = await this.hasher.hash(command.newPassword);
    await this.userRepo.updatePassword(user.id, hashed, false);
    await this.refreshRepo.revokeAllByUserId(user.id);
  }
}
