export class UpdateBannerCommand {
  constructor(
    public readonly id: string,
    public readonly title: string | undefined,
    public readonly subtitle: string | null | undefined,
    public readonly imageUrl: string | null | undefined,
    public readonly isActive: boolean | undefined,
    public readonly sortOrder: number | undefined,
    public readonly updatedBy: string,
  ) {}
}
