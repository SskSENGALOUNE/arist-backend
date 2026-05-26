import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  IExTableRepository,
  CreateExTableData,
  UpdateExTableData,
  ExTableData,
  PaginationParams,
  PaginatedResult,
} from '../../../domain/ex-module/ex-table.repository';

@Injectable()
export class ExTableRepositoryImpl implements IExTableRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateExTableData): Promise<ExTableData> {
    return this.prisma.exTable.create({
      data: {
        name: data.name,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
      },
    });
  }

  async findById(id: string): Promise<ExTableData | null> {
    return this.prisma.exTable.findUnique({ where: { id } });
  }

  async findAll(): Promise<ExTableData[]> {
    return this.prisma.exTable.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findPaginated(
    params: PaginationParams,
  ): Promise<PaginatedResult<ExTableData>> {
    const orderBy = {
      [params.sortBy ?? 'createdAt']: params.sortOrder ?? 'desc',
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.exTable.findMany({
        skip: params.skip,
        take: params.take,
        orderBy,
      }),
      this.prisma.exTable.count(),
    ]);

    return { items, total };
  }

  async update(id: string, data: UpdateExTableData): Promise<ExTableData> {
    return this.prisma.exTable.update({
      where: { id },
      data: { name: data.name, updatedBy: data.updatedBy },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.exTable.delete({ where: { id } });
  }
}
