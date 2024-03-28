export class RemoveAppointmentCommand {
  constructor(
    public readonly accountId: string,
    public readonly appointmentId: string,
  ) {}
}
