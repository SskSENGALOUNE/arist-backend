import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepositoryImpl } from '../prisma/repositories/user.repository.impl';
import { RefreshTokenRepositoryImpl } from '../prisma/repositories/refresh-token.repository.impl';
import { BcryptPasswordHasherAdapter } from '../auth/bcrypt-password-hasher.adapter';
import { JwtTokenServiceAdapter } from '../auth/jwt-token-service.adapter';
import { USER_REPOSITORY } from '../../domain/user/user.repository';
import { REFRESH_TOKEN_REPOSITORY } from '../../domain/user/refresh-token.repository';
import { PASSWORD_HASHER } from '../../domain/user/password-hasher.port';
import { TOKEN_SERVICE } from '../../domain/user/token-service.port';

@Module({
  imports: [PrismaModule, ConfigModule, JwtModule.register({})],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepositoryImpl },
    { provide: REFRESH_TOKEN_REPOSITORY, useClass: RefreshTokenRepositoryImpl },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasherAdapter },
    { provide: TOKEN_SERVICE, useClass: JwtTokenServiceAdapter },
  ],
  exports: [
    USER_REPOSITORY,
    REFRESH_TOKEN_REPOSITORY,
    PASSWORD_HASHER,
    TOKEN_SERVICE,
  ],
})
export class UserInfrastructureModule {}
