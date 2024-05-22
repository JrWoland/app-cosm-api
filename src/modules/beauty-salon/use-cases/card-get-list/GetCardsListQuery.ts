export class GetCardsListQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly accountId: string,
    public readonly clientId: string,
  ) {}
}
