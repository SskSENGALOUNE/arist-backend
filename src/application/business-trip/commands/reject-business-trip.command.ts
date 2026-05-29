export class RejectBusinessTripCommand {
  constructor(
    public readonly id: string,
    public readonly verifiedById: string,
    public readonly rejectionReason: string,
  ) {}
}
