export class GetAppointmentQuery {
  constructor(
    public readonly accountId: string,
    public readonly clientId: string,
    public readonly page: number,
    public readonly limit: number,
    public readonly status: string,
    public readonly dateFrom: string,
    public readonly dateTo: string,
    public readonly beautyServiceId: string,
  ) {}
}
