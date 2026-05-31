import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AdminUserController } from './admin-user.controller';
import { MeController } from './me.controller';
import { UserApplicationModule } from '../../application/user/user-application.module';
import { MinioModule } from '../../infrastructure/minio/minio.module';

@Module({
  imports: [CqrsModule, UserApplicationModule, MinioModule],
  controllers: [AdminUserController, MeController],
})
export class UserModule {}
