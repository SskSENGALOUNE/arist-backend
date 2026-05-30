export interface IPositionRepository {
  create(data: CreatePositionData): Promise<PositionData>;
  findById(id: string): Promise<PositionData | null>;
  findByName(name: string): Promise<PositionData | null>;
  findAll(activeOnly?: boolean): Promise<PositionData[]>;
  update(id: string, data: UpdatePositionData): Promise<PositionData>;
  delete(id: string): Promise<void>;
}

export interface CreatePositionData {
  name: string;
  createdBy: string;
  updatedBy: string;
}

export interface UpdatePositionData {
  name?: string;
  isActive?: boolean;
  updatedBy: string;
}

export interface PositionData {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
}

export const POSITION_REPOSITORY = Symbol('POSITION_REPOSITORY');
