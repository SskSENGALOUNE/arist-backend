import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AdminUserController } from './admin-user.controller';
import { MeController } from './me.controller';
import { UserApplicationModule } from '../../application/user/user-application.module';

@Module({
  imports: [CqrsModule, UserApplicationModule],
  controllers: [AdminUserController, MeController],
})
export class UserModule {}
