import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  IBannerRepository,
  CreateBannerData,
  UpdateBannerData,
  BannerData,
  PaginationParams,
  PaginatedResult,
} from '../../../domain/banner/banner.repository';

@Injectable()
export class BannerRepositoryImpl implements IBannerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBannerData): Promise<BannerData> {
    return this.prisma.banner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
      },
    });
  }

  async findById(id: string): Promise<BannerData | null> {
    return this.prisma.banner.findUnique({ where: { id } });
  }

  async findActive(): Promise<BannerData[]> {
    return this.prisma.banner.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findPaginated(
    params: PaginationParams,
  ): Promise<PaginatedResult<BannerData>> {
    const orderBy = {
      [params.sortBy ?? 'sortOrder']: params.sortOrder ?? 'asc',
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.banner.findMany({
        skip: params.skip,
        take: params.take,
        orderBy,
      }),
      this.prisma.banner.count(),
    ]);

    return { items, total };
  }

  async update(id: string, data: UpdateBannerData): Promise<BannerData> {
    return this.prisma.banner.update({
      where: { id },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
        updatedBy: data.updatedBy,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.banner.delete({ where: { id } });
  }
}
