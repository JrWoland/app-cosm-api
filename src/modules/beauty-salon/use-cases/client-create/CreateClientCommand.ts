export class CreateClientCommand {
  constructor(
    public readonly accountId: string,
    public readonly name: string,
    public readonly surname: string,
    public readonly birthDay?: string,
    public readonly phone?: string,
    public readonly email?: string,
  ) {}
}
