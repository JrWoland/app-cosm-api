export class GetCardByIdQuery {
  constructor(
    public readonly accountId: string,
    public readonly cardId: string,
  ) {}
}
