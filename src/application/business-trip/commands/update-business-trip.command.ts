import { Country, LaoProvince, TripType } from '@prisma/client';

export class UpdateBusinessTripCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title?: string,
    public readonly tripType?: TripType,
    public readonly destinationProvince?: LaoProvince | null,
    public readonly destinationCountry?: Country | null,
    public readonly departureDate?: Date,
    public readonly returnDate?: Date,
  ) {}
}
