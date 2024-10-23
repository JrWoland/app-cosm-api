export class ActivateClientCommand {
  constructor(
    public readonly accountId: string,
    public readonly clientId: string,
  ) {}
}
