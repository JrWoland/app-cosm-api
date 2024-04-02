export class GetClientsListQuery {
  constructor(
    public readonly accountId: string,
    public readonly page: number,
    public readonly limit: number,
    public readonly status: string,
    public readonly fullName: string,
  ) {}
}
