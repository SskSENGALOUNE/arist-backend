import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserInfrastructureModule } from '../../infrastructure/user/user-infrastructure.module';
import {
  LoginHandler,
  RefreshTokenHandler,
  LogoutHandler,
  ChangePasswordHandler,
  CompleteInitialPasswordHandler,
} from '../auth/commands';
import {
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
  ResetPasswordHandler,
  UpdateProfileHandler,
} from './commands';
import {
  GetUserByIdHandler,
  ListUsersHandler,
  GetUserStatsHandler,
} from './queries';

const AuthCommandHandlers = [
  LoginHandler,
  RefreshTokenHandler,
  LogoutHandler,
  ChangePasswordHandler,
  CompleteInitialPasswordHandler,
];

const UserCommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
  ResetPasswordHandler,
  UpdateProfileHandler,
];

const UserQueryHandlers = [
  GetUserByIdHandler,
  ListUsersHandler,
  GetUserStatsHandler,
];

@Module({
  imports: [CqrsModule, UserInfrastructureModule],
  providers: [
    ...AuthCommandHandlers,
    ...UserCommandHandlers,
    ...UserQueryHandlers,
  ],
  exports: [CqrsModule, UserInfrastructureModule],
})
export class UserApplicationModule {}
