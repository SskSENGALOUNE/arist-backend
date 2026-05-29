export class DeleteBusinessTripCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
