import { UserRole } from '../../../domain/user/user.entity';

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly updatedBy: string,
    public readonly data: {
      email?: string;
      role?: UserRole;
      isActive?: boolean;
      firstName?: string;
      lastName?: string;
    },
  ) {}
}
