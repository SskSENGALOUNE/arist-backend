export class CreatePositionCommand {
  constructor(
    public readonly name: string,
    public readonly createdBy: string,
  ) {}
}
