import { Gender, UserRole } from '../../../domain/user/user.entity';

export class CreateUserCommand {
  constructor(
    public readonly username: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly createdBy: string,
    public readonly gender?: Gender | null,
    public readonly departmentId?: string | null,
    public readonly positionId?: string | null,
  ) {}
}
