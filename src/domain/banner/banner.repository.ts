export interface IBannerRepository {
  create(data: CreateBannerData): Promise<BannerData>;
  findById(id: string): Promise<BannerData | null>;
  findActive(): Promise<BannerData[]>;
  findPaginated(params: PaginationParams): Promise<PaginatedResult<BannerData>>;
  update(id: string, data: UpdateBannerData): Promise<BannerData>;
  delete(id: string): Promise<void>;
}

export interface CreateBannerData {
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdBy: string;
  updatedBy: string;
}

export interface UpdateBannerData {
  title?: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  updatedBy: string;
}

export interface BannerData {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
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

export const BANNER_REPOSITORY = Symbol('BANNER_REPOSITORY');
