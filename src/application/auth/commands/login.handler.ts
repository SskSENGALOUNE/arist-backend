import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { LoginCommand } from './login.command';
import { USER_REPOSITORY } from '../../../domain/user/user.repository';
import type { IUserRepository } from '../../../domain/user/user.repository';
import { REFRESH_TOKEN_REPOSITORY } from '../../../domain/user/refresh-token.repository';
import type { IRefreshTokenRepository } from '../../../domain/user/refresh-token.repository';
import { PASSWORD_HASHER } from '../../../domain/user/password-hasher.port';
import type { IPasswordHasher } from '../../../domain/user/password-hasher.port';
import { TOKEN_SERVICE } from '../../../domain/user/token-service.port';
import type { ITokenService } from '../../../domain/user/token-service.port';
import {
  ForbiddenDomainException,
  UnauthorizedDomainException,
} from '../../../domain/exceptions';

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    mustChangePassword: boolean;
  };
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand, LoginResult> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshRepo: IRefreshTokenRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: IPasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokens: ITokenService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const user = await this.userRepo.findByUsernameWithPassword(
      command.username,
    );
    if (!user) {
      throw new UnauthorizedDomainException('Invalid username or password');
    }

    if (!user.isActive) {
      throw new ForbiddenDomainException('Account is disabled');
    }

    const valid = await this.hasher.compare(command.password, user.password);
    if (!valid) {
      throw new UnauthorizedDomainException('Invalid username or password');
    }

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

    await this.userRepo.updateLastLogin(user.id, new Date());

    return {
      accessToken: issued.accessToken,
      refreshToken: issued.refreshToken,
      accessTokenExpiresAt: issued.accessTokenExpiresAt,
      refreshTokenExpiresAt: issued.refreshTokenExpiresAt,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        mustChangePassword: user.mustChangePassword,
      },
    };
  }
}
