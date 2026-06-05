export class GetAllBusinessTripsQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly sortBy?: string,
    public readonly sortOrder: 'asc' | 'desc' = 'desc',
    public readonly search?: string,
  ) {}

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
