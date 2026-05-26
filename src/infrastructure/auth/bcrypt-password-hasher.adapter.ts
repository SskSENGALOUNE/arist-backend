import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { IPasswordHasher } from '../../domain/user/password-hasher.port';
import type { AuthConfig } from '../../config/auth.config';

@Injectable()
export class BcryptPasswordHasherAdapter implements IPasswordHasher {
  private readonly saltRounds: number;

  constructor(@Inject(ConfigService) configService: ConfigService) {
    const cfg = configService.get<AuthConfig>('auth')!;
    this.saltRounds = cfg.bcryptSaltRounds;
  }

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
