import { Injectable } from '@nestjs/common';
import { TripStatus } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import {
  IBusinessTripRepository,
  CreateBusinessTripData,
  UpdateBusinessTripData,
  BusinessTripData,
  PaginationParams,
  PaginatedResult,
} from '../../../domain/business-trip/business-trip.repository';

const userInclude = {
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
} as const;

@Injectable()
export class BusinessTripRepositoryImpl implements IBusinessTripRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBusinessTripData): Promise<BusinessTripData> {
    return this.prisma.businessTrip.create({
      data: {
        title: data.title,
        tripType: data.tripType,
        destinationProvince: data.destinationProvince,
        destinationCountry: data.destinationCountry,
        departureDate: data.departureDate,
        returnDate: data.returnDate,
        status: data.status,
        userId: data.userId,
      },
      include: userInclude,
    });
  }

  async findById(id: string): Promise<BusinessTripData | null> {
    return this.prisma.businessTrip.findUnique({
      where: { id },
      include: userInclude,
    });
  }

  async findByUser(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResult<BusinessTripData>> {
    const orderBy = {
      [params.sortBy ?? 'createdAt']: params.sortOrder ?? 'desc',
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.businessTrip.findMany({
        where: { userId },
        skip: params.skip,
        take: params.take,
        orderBy,
        include: userInclude,
      }),
      this.prisma.businessTrip.count({ where: { userId } }),
    ]);

    return { items, total };
  }

  async findAll(
    params: PaginationParams,
  ): Promise<PaginatedResult<BusinessTripData>> {
    const orderBy = {
      [params.sortBy ?? 'createdAt']: params.sortOrder ?? 'desc',
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.businessTrip.findMany({
        skip: params.skip,
        take: params.take,
        orderBy,
        include: userInclude,
      }),
      this.prisma.businessTrip.count(),
    ]);

    return { items, total };
  }

  async update(
    id: string,
    data: UpdateBusinessTripData,
  ): Promise<BusinessTripData> {
    return this.prisma.businessTrip.update({
      where: { id },
      data: {
        title: data.title,
        tripType: data.tripType,
        destinationProvince: data.destinationProvince,
        destinationCountry: data.destinationCountry,
        departureDate: data.departureDate,
        returnDate: data.returnDate,
      },
      include: userInclude,
    });
  }

  async verify(id: string, verifiedById: string): Promise<BusinessTripData> {
    return this.prisma.businessTrip.update({
      where: { id },
      data: {
        status: TripStatus.VERIFIED,
        verifiedById,
        verifiedAt: new Date(),
        rejectionReason: null,
      },
      include: userInclude,
    });
  }

  async reject(
    id: string,
    verifiedById: string,
    rejectionReason: string,
  ): Promise<BusinessTripData> {
    return this.prisma.businessTrip.update({
      where: { id },
      data: {
        status: TripStatus.REJECTED,
        verifiedById,
        verifiedAt: new Date(),
        rejectionReason,
      },
      include: userInclude,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.businessTrip.delete({ where: { id } });
  }
}
