export class CreateDepartmentCommand {
  constructor(
    public readonly name: string,
    public readonly createdBy: string,
  ) {}
}
