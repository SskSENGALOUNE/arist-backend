import { UserRole } from '../../../domain/user/user.entity';

export class ListUsersQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly role?: UserRole,
    public readonly search?: string,
    public readonly sortBy?: string,
    public readonly sortOrder: 'asc' | 'desc' = 'desc',
  ) {}

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
