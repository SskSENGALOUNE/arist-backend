import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import type {
  CreateUserData,
  IUserRepository,
  ListUsersParams,
  PaginatedUsers,
  PassportStats,
  UserStats,
  UpdateProfileData,
  UpdateUserData,
  UserData,
} from '../../../domain/user/user.repository';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserData): Promise<UserData> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: data.password,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: (data.gender ?? null) as Prisma.UserCreateInput['gender'],
        mustChangePassword: data.mustChangePassword ?? true,
        createdBy: data.createdBy ?? null,
        updatedBy: data.createdBy ?? null,
        departmentId: data.departmentId ?? null,
        positionId: data.positionId ?? null,
      },
    });
    return user as UserData;
  }

  async findById(id: string): Promise<UserData | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user as UserData | null;
  }

  async findByUsername(username: string): Promise<UserData | null> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    return user as UserData | null;
  }

  async findByEmail(email: string): Promise<UserData | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user as UserData | null;
  }

  async findByIdWithPassword(id: string): Promise<UserData | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: false },
    });
    return user as UserData | null;
  }

  async findByUsernameWithPassword(username: string): Promise<UserData | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      omit: { password: false },
    });
    return user as UserData | null;
  }

  async findPaginated(params: ListUsersParams): Promise<PaginatedUsers> {
    const where: Prisma.UserWhereInput = {};
    if (params.role) where.role = params.role;
    if (params.search) {
      where.OR = [
        { username: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const orderBy = {
      [params.sortBy ?? 'createdAt']: params.sortOrder ?? 'desc',
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items: items as UserData[], total };
  }

  async getStats(): Promise<UserStats> {
    const [total, active, admins] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { role: 'ADMIN' } }),
    ]);

    return { total, active, inactive: total - active, admins };
  }

  async getPassportStats(): Promise<PassportStats> {
    const withPassport = await this.prisma.user.count({
      where: { passportExpiry: { not: null } },
    });
    const withoutPassport = await this.prisma.user.count({
      where: { passportExpiry: null },
    });
    return { withPassport, withoutPassport };
  }

  async update(id: string, data: UpdateUserData): Promise<UserData> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        role: data.role,
        isActive: data.isActive,
        firstName: data.firstName,
        lastName: data.lastName,
        departmentId: data.departmentId,
        positionId: data.positionId,
        updatedBy: data.updatedBy ?? null,
      },
    });
    return user as UserData;
  }

  async updateProfile(id: string, data: UpdateProfileData): Promise<UserData> {
    const updateData: Prisma.UserUpdateInput = {
      photoUrl: data.photoUrl,
      gender: data.gender as Prisma.UserUpdateInput['gender'],
      educationLevel: data.educationLevel as Prisma.UserUpdateInput['educationLevel'],
      institutionName: data.institutionName,
      graduatedFrom: data.graduatedFrom as Prisma.UserUpdateInput['graduatedFrom'],
      graduatedCountry: data.graduatedCountry as Prisma.UserUpdateInput['graduatedCountry'],
      fieldOfStudy: data.fieldOfStudy,
      englishLevel: data.englishLevel as Prisma.UserUpdateInput['englishLevel'],
      vietnameseLevel: data.vietnameseLevel as Prisma.UserUpdateInput['vietnameseLevel'],
      chineseLevel: data.chineseLevel as Prisma.UserUpdateInput['chineseLevel'],
      otherLanguages: data.otherLanguages,
      passportExpiry: data.passportExpiry,
      updatedBy: data.updatedBy ?? null,
    };
    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });
    return user as UserData;
  }

  async updatePassword(
    id: string,
    hashedPassword: string,
    mustChangePassword: boolean,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword, mustChangePassword },
    });
  }

  async updateLastLogin(id: string, at: Date): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: at },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
