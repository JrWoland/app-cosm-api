export class CreateAppointmentCommand {
  constructor(
    public readonly accountId: string,
    public readonly date: string,
    public readonly clientId: string,
    public readonly startTime: number,
    public readonly status: string,
    public readonly treatments: { readonly startTime: number; readonly duration: number; readonly id: string }[],
  ) {}
}
