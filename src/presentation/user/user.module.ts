import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AdminUserController } from './admin-user.controller';
import { MeController } from './me.controller';
import { UserApplicationModule } from '../../application/user/user-application.module';
import { SupabaseModule } from '../../infrastructure/supabase/supabase.module';

@Module({
  imports: [CqrsModule, UserApplicationModule, SupabaseModule],
  controllers: [AdminUserController, MeController],
})
export class UserModule {}
