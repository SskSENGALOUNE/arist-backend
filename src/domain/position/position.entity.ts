export class Position {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly createdBy: string | null,
    public readonly updatedAt: Date,
    public readonly updatedBy: string | null,
  ) {}

  static create(params: { name: string; createdBy: string }): {
    name: string;
    isActive: boolean;
    createdBy: string;
    updatedBy: string;
  } {
    return {
      name: params.name,
      isActive: true,
      createdBy: params.createdBy,
      updatedBy: params.createdBy,
    };
  }

  static reconstitute(
    id: string,
    name: string,
    isActive: boolean,
    createdAt: Date,
    createdBy: string | null,
    updatedAt: Date,
    updatedBy: string | null,
  ): Position {
    return new Position(id, name, isActive, createdAt, createdBy, updatedAt, updatedBy);
  }
}
