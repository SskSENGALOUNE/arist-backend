import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type {
  IDepartmentRepository,
  CreateDepartmentData,
  UpdateDepartmentData,
  DepartmentData,
} from '../../../domain/department/department.repository';

@Injectable()
export class DepartmentRepositoryImpl implements IDepartmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDepartmentData): Promise<DepartmentData> {
    return this.prisma.department.create({ data }) as Promise<DepartmentData>;
  }

  async findById(id: string): Promise<DepartmentData | null> {
    return this.prisma.department.findUnique({ where: { id } }) as Promise<DepartmentData | null>;
  }

  async findByName(name: string): Promise<DepartmentData | null> {
    return this.prisma.department.findUnique({ where: { name } }) as Promise<DepartmentData | null>;
  }

  async findAll(activeOnly?: boolean): Promise<DepartmentData[]> {
    const where = activeOnly ? { isActive: true } : {};
    return this.prisma.department.findMany({
      where,
      orderBy: { name: 'asc' },
    }) as Promise<DepartmentData[]>;
  }

  async update(id: string, data: UpdateDepartmentData): Promise<DepartmentData> {
    return this.prisma.department.update({
      where: { id },
      data,
    }) as Promise<DepartmentData>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.department.delete({ where: { id } });
  }
}
