import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RefreshTokenCommand } from './refresh-token.command';
import { USER_REPOSITORY } from '../../../domain/user/user.repository';
import type { IUserRepository } from '../../../domain/user/user.repository';
import { REFRESH_TOKEN_REPOSITORY } from '../../../domain/user/refresh-token.repository';
import type { IRefreshTokenRepository } from '../../../domain/user/refresh-token.repository';
import { TOKEN_SERVICE } from '../../../domain/user/token-service.port';
import type { ITokenService } from '../../../domain/user/token-service.port';
import {
  ForbiddenDomainException,
  UnauthorizedDomainException,
} from '../../../domain/exceptions';

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand, RefreshTokenResult>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshRepo: IRefreshTokenRepository,
    @Inject(TOKEN_SERVICE)
    private readonly tokens: ITokenService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
    const payload = await this.tokens.verifyRefresh(command.refreshToken);

    const tokenHash = this.tokens.hashRefreshToken(command.refreshToken);
    const stored = await this.refreshRepo.findByTokenHash(tokenHash);
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedDomainException('Refresh token is revoked or expired');
    }

    const user = await this.userRepo.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedDomainException('User no longer exists');
    }
    if (!user.isActive) {
      throw new ForbiddenDomainException('Account is disabled');
    }

    await this.refreshRepo.revokeById(stored.id);

    const issued = await this.tokens.issue({
      sub: user.id,
      username: user.username,
      role: user.role,
    });

    await this.refreshRepo.create({
      userId: user.id,
      tokenHash: this.tokens.hashRefreshToken(issued.refreshToken),
      expiresAt: issued.refreshTokenExpiresAt,
      userAgent: command.userAgent ?? null,
      ipAddress: command.ipAddress ?? null,
    });

    return {
      accessToken: issued.accessToken,
      refreshToken: issued.refreshToken,
      accessTokenExpiresAt: issued.accessTokenExpiresAt,
      refreshTokenExpiresAt: issued.refreshTokenExpiresAt,
    };
  }
}
