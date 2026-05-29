import { Country, LaoProvince, TripType } from '@prisma/client';

export class CreateBusinessTripCommand {
  constructor(
    public readonly title: string,
    public readonly tripType: TripType,
    public readonly destinationProvince: LaoProvince | null,
    public readonly destinationCountry: Country | null,
    public readonly departureDate: Date,
    public readonly returnDate: Date,
    public readonly userId: string,
  ) {}
}
