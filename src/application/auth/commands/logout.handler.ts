import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { LogoutCommand } from './logout.command';
import { REFRESH_TOKEN_REPOSITORY } from '../../../domain/user/refresh-token.repository';
import type { IRefreshTokenRepository } from '../../../domain/user/refresh-token.repository';
import { TOKEN_SERVICE } from '../../../domain/user/token-service.port';
import type { ITokenService } from '../../../domain/user/token-service.port';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand, void> {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshRepo: IRefreshTokenRepository,
    @Inject(TOKEN_SERVICE)
    private readonly tokens: ITokenService,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    if (command.allDevices) {
      await this.refreshRepo.revokeAllByUserId(command.userId);
      return;
    }

    if (command.refreshToken) {
      const hash = this.tokens.hashRefreshToken(command.refreshToken);
      const stored = await this.refreshRepo.findByTokenHash(hash);
      if (stored && stored.userId === command.userId) {
        await this.refreshRepo.revokeById(stored.id);
      }
    }
  }
}
