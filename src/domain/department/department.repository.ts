export interface IDepartmentRepository {
  create(data: CreateDepartmentData): Promise<DepartmentData>;
  findById(id: string): Promise<DepartmentData | null>;
  findByName(name: string): Promise<DepartmentData | null>;
  findAll(activeOnly?: boolean): Promise<DepartmentData[]>;
  update(id: string, data: UpdateDepartmentData): Promise<DepartmentData>;
  delete(id: string): Promise<void>;
}

export interface CreateDepartmentData {
  name: string;
  createdBy: string;
  updatedBy: string;
}

export interface UpdateDepartmentData {
  name?: string;
  isActive?: boolean;
  updatedBy: string;
}

export interface DepartmentData {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
}

export const DEPARTMENT_REPOSITORY = Symbol('DEPARTMENT_REPOSITORY');
