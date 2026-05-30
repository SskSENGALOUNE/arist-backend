export class UpdateDepartmentCommand {
  constructor(
    public readonly id: string,
    public readonly updatedBy: string,
    public readonly name?: string,
    public readonly isActive?: boolean,
  ) {}
}
