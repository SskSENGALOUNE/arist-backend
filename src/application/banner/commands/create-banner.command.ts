export class CreateBannerCommand {
  constructor(
    public readonly title: string,
    public readonly subtitle: string | null,
    public readonly imageUrl: string | null,
    public readonly isActive: boolean | undefined,
    public readonly sortOrder: number | undefined,
    public readonly createdBy: string,
  ) {}
}
