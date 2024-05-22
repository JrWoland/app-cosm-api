export class DeleteCardByIdQuery {
  constructor(
    public readonly accountId: string,
    public readonly cardId: string,
  ) {}
}
