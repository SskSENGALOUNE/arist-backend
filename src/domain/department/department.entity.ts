export class Department {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly createdBy: string | null,
    public readonly updatedAt: Date,
    public readonly updatedBy: string | null,
  ) { }

  static reconstitute(
    id: string,
    name: string,
    isActive: boolean,
    createdAt: Date,
    createdBy: string | null,
    updatedAt: Date,
    updatedBy: string | null,
  ): Department {
    return new Department(id, name, isActive, createdAt, createdBy, updatedAt, updatedBy);
  }
}
