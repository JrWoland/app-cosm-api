export class GetTreatmentsListQuery {
  constructor(
    public readonly accountId: string,
    public readonly page: number,
    public readonly limit: number,
    public readonly status: string,
    public readonly name: string,
  ) {}
}
