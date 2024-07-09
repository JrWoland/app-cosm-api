export class GetAppointmentByIdQuery {
  constructor(
    public readonly accountId: string,
    public readonly appointmentId: string,
  ) {}
}
