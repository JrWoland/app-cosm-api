export class CreateCardCommand {
  constructor(
    public readonly accountId: string,
    public readonly clientId: string,
    public readonly date: string,
    public readonly template: Record<string, unknown>,
    public readonly appointmentId: string | null,
  ) {}
}
