import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomUUID } from 'crypto';
import {
  AccessTokenPayload,
  IssuedTokens,
  ITokenService,
} from '../../domain/user/token-service.port';
import { UnauthorizedDomainException } from '../../domain/exceptions';
import type { AuthConfig } from '../../config/auth.config';

interface RefreshPayload extends AccessTokenPayload {
  jti: string;
}

@Injectable()
export class JwtTokenServiceAdapter implements ITokenService {
  private readonly accessSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshSecret: string;
  private readonly refreshExpiresIn: string;

  constructor(
    @Inject(ConfigService) configService: ConfigService,
    private readonly jwt: JwtService,
  ) {
    const cfg = configService.get<AuthConfig>('auth')!;
    this.accessSecret = cfg.accessTokenSecret;
    this.accessExpiresIn = cfg.accessTokenExpiresIn;
    this.refreshSecret = cfg.refreshTokenSecret;
    this.refreshExpiresIn = cfg.refreshTokenExpiresIn;
  }

  async issue(payload: AccessTokenPayload): Promise<IssuedTokens> {
    const accessToken = await this.jwt.signAsync(
      { ...payload },
      {
        secret: this.accessSecret,
        expiresIn: this.accessExpiresIn as unknown as number,
      },
    );

    const refreshPayload: RefreshPayload = { ...payload, jti: randomUUID() };
    const refreshToken = await this.jwt.signAsync(
      { ...refreshPayload },
      {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn as unknown as number,
      },
    );

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt: this.decodeExpiry(accessToken),
      refreshTokenExpiresAt: this.decodeExpiry(refreshToken),
    };
  }

  async verifyAccess(token: string): Promise<AccessTokenPayload> {
    try {
      return await this.jwt.verifyAsync<AccessTokenPayload>(token, {
        secret: this.accessSecret,
      });
    } catch {
      throw new UnauthorizedDomainException('Invalid or expired access token');
    }
  }

  async verifyRefresh(token: string): Promise<AccessTokenPayload> {
    try {
      const payload = await this.jwt.verifyAsync<RefreshPayload>(token, {
        secret: this.refreshSecret,
      });
      return {
        sub: payload.sub,
        username: payload.username,
        role: payload.role,
      };
    } catch {
      throw new UnauthorizedDomainException('Invalid or expired refresh token');
    }
  }

  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private decodeExpiry(token: string): Date {
    const decoded = this.jwt.decode(token) as { exp?: number } | null;
    if (!decoded?.exp) {
      throw new Error('Token does not contain exp claim');
    }
    return new Date(decoded.exp * 1000);
  }
}
