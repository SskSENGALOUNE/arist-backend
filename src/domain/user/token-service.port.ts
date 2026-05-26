import { UserRole } from './user.entity';

export interface AccessTokenPayload {
  sub: string;
  username: string;
  role: UserRole;
}

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

export interface ITokenService {
  issue(payload: AccessTokenPayload): Promise<IssuedTokens>;
  verifyAccess(token: string): Promise<AccessTokenPayload>;
  verifyRefresh(token: string): Promise<AccessTokenPayload>;
  hashRefreshToken(token: string): string;
}

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');
