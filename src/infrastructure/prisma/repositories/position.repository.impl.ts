import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type {
  IPositionRepository,
  CreatePositionData,
  UpdatePositionData,
  PositionData,
} from '../../../domain/position/position.repository';

@Injectable()
export class PositionRepositoryImpl implements IPositionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePositionData): Promise<PositionData> {
    return this.prisma.position.create({ data }) as Promise<PositionData>;
  }

  async findById(id: string): Promise<PositionData | null> {
    return this.prisma.position.findUnique({ where: { id } }) as Promise<PositionData | null>;
  }

  async findByName(name: string): Promise<PositionData | null> {
    return this.prisma.position.findUnique({ where: { name } }) as Promise<PositionData | null>;
  }

  async findAll(activeOnly?: boolean): Promise<PositionData[]> {
    const where = activeOnly ? { isActive: true } : {};
    return this.prisma.position.findMany({
      where,
      orderBy: { name: 'asc' },
    }) as Promise<PositionData[]>;
  }

  async update(id: string, data: UpdatePositionData): Promise<PositionData> {
    return this.prisma.position.update({
      where: { id },
      data,
    }) as Promise<PositionData>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.position.delete({ where: { id } });
  }
}
