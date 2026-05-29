import { Country, LaoProvince, TripStatus, TripType } from "@prisma/client";

export class BusinessTrip {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly tripType: TripType,
    public readonly destinationProvince: LaoProvince | null,
    public readonly destinationCountry: Country | null,
    public readonly departureDate: Date,
    public readonly returnDate: Date,
    public readonly status: TripStatus,
    public readonly submittedAt: Date | null,
    public readonly verifiedAt: Date | null,
    public readonly verifiedById: string | null,
    public readonly rejectionReason: string | null,
    public readonly userId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(params: {
    title: string;
    tripType: TripType;
    destinationProvince?: LaoProvince | null;
    destinationCountry?: Country | null;
    departureDate: Date;
    returnDate: Date;
    userId: string;
  }): {
    title: string;
    tripType: TripType;
    destinationProvince: LaoProvince | null;
    destinationCountry: Country | null;
    departureDate: Date;
    returnDate: Date;
    status: TripStatus;
    userId: string;
  } {
    return {
      title: params.title,
      tripType: params.tripType,
      destinationProvince: params.destinationProvince ?? null,
      destinationCountry: params.destinationCountry ?? null,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      status: TripStatus.DRAFT,
      userId: params.userId,
    };
  }

  static reconstitute(
    id: string,
    title: string,
    tripType: TripType,
    destinationProvince: LaoProvince | null,
    destinationCountry: Country | null,
    departureDate: Date,
    returnDate: Date,
    status: TripStatus,
    submittedAt: Date | null,
    verifiedAt: Date | null,
    verifiedById: string | null,
    rejectionReason: string | null,
    userId: string,
    createdAt: Date,
    updatedAt: Date,
  ): BusinessTrip {
    return new BusinessTrip(
      id,
      title,
      tripType,
      destinationProvince,
      destinationCountry,
      departureDate,
      returnDate,
      status,
      submittedAt,
      verifiedAt,
      verifiedById,
      rejectionReason,
      userId,
      createdAt,
      updatedAt,
    );
  }

  update(params: {
    title?: string;
    tripType?: TripType;
    destinationProvince?: LaoProvince | null;
    destinationCountry?: Country | null;
    departureDate?: Date;
    returnDate?: Date;
  }): {
    title?: string;
    tripType?: TripType;
    destinationProvince?: LaoProvince | null;
    destinationCountry?: Country | null;
    departureDate?: Date;
    returnDate?: Date;
  } {
    const patch: {
      title?: string;
      tripType?: TripType;
      destinationProvince?: LaoProvince | null;
      destinationCountry?: Country | null;
      departureDate?: Date;
      returnDate?: Date;
    } = {};
    if (params.title !== undefined) patch.title = params.title;
    if (params.tripType !== undefined) patch.tripType = params.tripType;
    if (params.destinationProvince !== undefined)
      patch.destinationProvince = params.destinationProvince;
    if (params.destinationCountry !== undefined)
      patch.destinationCountry = params.destinationCountry;
    if (params.departureDate !== undefined)
      patch.departureDate = params.departureDate;
    if (params.returnDate !== undefined) patch.returnDate = params.returnDate;
    return patch;
  }
}
