import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../../domain/user/user.entity';

export interface AuthenticatedUser {
  id: string;
  username: string;
  role: UserRole;
}

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const req = ctx.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    return req.user;
  },
);
