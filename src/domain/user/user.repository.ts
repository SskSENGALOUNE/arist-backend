import {
  Country,
  EducationLevel,
  Gender,
  GraduatedFrom,
  LanguageLevel,
  UserRole,
} from './user.entity';

export interface UserData {
  id: string;
  email: string;
  username: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: Date | null;
  mustChangePassword: boolean;

  photoUrl: string | null;
  firstName: string;
  lastName: string;
  gender: Gender | null;
  educationLevel: EducationLevel | null;
  institutionName: string | null;
  graduatedFrom: GraduatedFrom | null;
  graduatedCountry: Country | null;
  fieldOfStudy: string | null;
  englishLevel: LanguageLevel | null;
  vietnameseLevel: LanguageLevel | null;
  chineseLevel: LanguageLevel | null;
  otherLanguages: string | null;
  passportExpiry: Date | null;

  departmentId: string | null;
  positionId: string | null;

  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
}

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  gender?: Gender | null;
  mustChangePassword?: boolean;
  createdBy?: string | null;
  departmentId?: string | null;
  positionId?: string | null;
}

export interface UpdateUserData {
  email?: string;
  role?: UserRole;
  isActive?: boolean;
  firstName?: string;
  lastName?: string;
  departmentId?: string | null;
  positionId?: string | null;
  updatedBy?: string | null;
}

export interface UpdateProfileData {
  photoUrl?: string | null;
  gender?: Gender | null;
  educationLevel?: EducationLevel | null;
  institutionName?: string | null;
  graduatedFrom?: GraduatedFrom | null;
  graduatedCountry?: Country | null;
  fieldOfStudy?: string | null;
  englishLevel?: LanguageLevel | null;
  vietnameseLevel?: LanguageLevel | null;
  chineseLevel?: LanguageLevel | null;
  otherLanguages?: string | null;
  passportExpiry?: Date | null;
  updatedBy?: string | null;
}

export interface ListUsersParams {
  skip: number;
  take: number;
  role?: UserRole;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedUsers {
  items: UserData[];
  total: number;
}

export interface IUserRepository {
  create(data: CreateUserData): Promise<UserData>;
  findById(id: string): Promise<UserData | null>;
  findByUsername(username: string): Promise<UserData | null>;
  findByEmail(email: string): Promise<UserData | null>;
  /** Includes the password hash; only for auth flows that verify it. */
  findByIdWithPassword(id: string): Promise<UserData | null>;
  /** Includes the password hash; only for auth flows that verify it. */
  findByUsernameWithPassword(username: string): Promise<UserData | null>;
  findPaginated(params: ListUsersParams): Promise<PaginatedUsers>;
  update(id: string, data: UpdateUserData): Promise<UserData>;
  updateProfile(id: string, data: UpdateProfileData): Promise<UserData>;
  updatePassword(
    id: string,
    hashedPassword: string,
    mustChangePassword: boolean,
  ): Promise<void>;
  updateLastLogin(id: string, at: Date): Promise<void>;
  delete(id: string): Promise<void>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
