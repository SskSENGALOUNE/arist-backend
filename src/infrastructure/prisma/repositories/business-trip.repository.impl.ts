import { Injectable } from '@nestjs/common';
import { Prisma, TripStatus } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import {
  IBusinessTripRepository,
  CreateBusinessTripData,
  UpdateBusinessTripData,
  BusinessTripData,
  PaginationParams,
  PaginatedResult,
  TripStats,
  DestinationStats,
  TopTravelersParams,
  TravelerStat,
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

    const where: Prisma.BusinessTripWhereInput = {};
    if (params.search) {
      const search = params.search;
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.businessTrip.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy,
        include: userInclude,
      }),
      this.prisma.businessTrip.count({ where }),
    ]);

    return { items, total };
  }

  async getStats(): Promise<TripStats> {
    const grouped = await this.prisma.businessTrip.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    const counts = grouped.reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = row._count._all;
      return acc;
    }, {});

    const pending = counts[TripStatus.PENDING] ?? 0;
    const verified = counts[TripStatus.VERIFIED] ?? 0;
    const rejected = counts[TripStatus.REJECTED] ?? 0;
    const draft = counts[TripStatus.DRAFT] ?? 0;

    return {
      total: pending + verified + rejected + draft,
      pending,
      verified,
      rejected,
      draft,
    };
  }

  async getDestinationStats(limit: number): Promise<DestinationStats> {
    const [countries, provinces] = await Promise.all([
      this.prisma.businessTrip.groupBy({
        by: ['destinationCountry'],
        where: { destinationCountry: { not: null } },
        _count: { _all: true },
        orderBy: { _count: { destinationCountry: 'desc' } },
        take: limit,
      }),
      this.prisma.businessTrip.groupBy({
        by: ['destinationProvince'],
        where: { destinationProvince: { not: null } },
        _count: { _all: true },
        orderBy: { _count: { destinationProvince: 'desc' } },
        take: limit,
      }),
    ]);

    return {
      topCountries: countries.map((row) => ({
        name: row.destinationCountry as string,
        count: row._count._all,
      })),
      topProvinces: provinces.map((row) => ({
        name: row.destinationProvince as string,
        count: row._count._all,
      })),
    };
  }

  async getTopTravelers(
    params: TopTravelersParams,
  ): Promise<PaginatedResult<TravelerStat>> {
    const where: Prisma.BusinessTripWhereInput = {};
    if (params.tripType) where.tripType = params.tripType;
    if (params.month !== undefined && params.year !== undefined) {
      const start = new Date(params.year, params.month - 1, 1);
      const end = new Date(params.year, params.month, 1);
      where.departureDate = { gte: start, lt: end };
    }

    // One group per traveller, ordered by trip count desc.
    const groups = await this.prisma.businessTrip.groupBy({
      by: ['userId'],
      where,
      _count: { _all: true },
      orderBy: { _count: { userId: 'desc' } },
    });

    const total = groups.length;
    const pageGroups = groups.slice(params.skip, params.skip + params.take);

    const users = await this.prisma.user.findMany({
      where: { id: { in: pageGroups.map((g) => g.userId) } },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    const items: TravelerStat[] = pageGroups.map((g) => {
      const u = userMap.get(g.userId);
      return {
        userId: g.userId,
        firstName: u?.firstName ?? '',
        lastName: u?.lastName ?? '',
        email: u?.email ?? '',
        tripCount: g._count._all,
      };
    });

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
