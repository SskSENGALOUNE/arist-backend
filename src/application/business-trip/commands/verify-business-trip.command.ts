export class VerifyBusinessTripCommand {
  constructor(
    public readonly id: string,
    public readonly verifiedById: string,
  ) {}
}
