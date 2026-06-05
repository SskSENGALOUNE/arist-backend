import { TripType } from '@prisma/client';

export class GetTopTravelersQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly tripType?: TripType,
  ) {}

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
