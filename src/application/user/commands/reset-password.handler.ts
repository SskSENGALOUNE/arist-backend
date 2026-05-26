import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ResetPasswordCommand } from './reset-password.command';
import { USER_REPOSITORY } from '../../../domain/user/user.repository';
import type { IUserRepository } from '../../../domain/user/user.repository';
import { REFRESH_TOKEN_REPOSITORY } from '../../../domain/user/refresh-token.repository';
import type { IRefreshTokenRepository } from '../../../domain/user/refresh-token.repository';
import { PASSWORD_HASHER } from '../../../domain/user/password-hasher.port';
import type { IPasswordHasher } from '../../../domain/user/password-hasher.port';
import { NotFoundDomainException } from '../../../domain/exceptions';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand, void>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshRepo: IRefreshTokenRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: IPasswordHasher,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const existing = await this.userRepo.findById(command.userId);
    if (!existing) {
      throw NotFoundDomainException.forResource('User', command.userId);
    }

    const hashed = await this.hasher.hash(command.newPassword);
    await this.userRepo.updatePassword(command.userId, hashed, true);
    await this.refreshRepo.revokeAllByUserId(command.userId);
  }
}
