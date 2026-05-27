export class CompleteInitialPasswordCommand {
  constructor(
    public readonly userId: string,
    public readonly newPassword: string,
  ) {}
}
