import { Country, LaoProvince, TripStatus, TripType } from '@prisma/client';

export interface IBusinessTripRepository {
  create(data: CreateBusinessTripData): Promise<BusinessTripData>;
  findById(id: string): Promise<BusinessTripData | null>;
  findByUser(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResult<BusinessTripData>>;
  findAll(
    params: PaginationParams,
  ): Promise<PaginatedResult<BusinessTripData>>;
  update(id: string, data: UpdateBusinessTripData): Promise<BusinessTripData>;
  verify(id: string, verifiedById: string): Promise<BusinessTripData>;
  reject(
    id: string,
    verifiedById: string,
    rejectionReason: string,
  ): Promise<BusinessTripData>;
  delete(id: string): Promise<void>;
}

export interface CreateBusinessTripData {
  title: string;
  tripType: TripType;
  destinationProvince: LaoProvince | null;
  destinationCountry: Country | null;
  departureDate: Date;
  returnDate: Date;
  status: TripStatus;
  userId: string;
}

export interface UpdateBusinessTripData {
  title?: string;
  tripType?: TripType;
  destinationProvince?: LaoProvince | null;
  destinationCountry?: Country | null;
  departureDate?: Date;
  returnDate?: Date;
}

export interface BusinessTripUserSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface BusinessTripData {
  id: string;
  title: string;
  tripType: TripType;
  destinationProvince: LaoProvince | null;
  destinationCountry: Country | null;
  departureDate: Date;
  returnDate: Date;
  status: TripStatus;
  submittedAt: Date | null;
  verifiedAt: Date | null;
  verifiedById: string | null;
  rejectionReason: string | null;
  userId: string;
  user?: BusinessTripUserSummary;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  skip: number;
  take: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export const BUSINESS_TRIP_REPOSITORY = Symbol('BUSINESS_TRIP_REPOSITORY');
