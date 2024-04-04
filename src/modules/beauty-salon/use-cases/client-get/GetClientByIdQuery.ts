export class GetClientByIdQuery {
  constructor(
    public readonly accountId: string,
    public readonly clientId: string,
  ) {}
}
