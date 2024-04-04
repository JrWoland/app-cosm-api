export class EditClientDetailsCommand {
  constructor(
    public readonly accountId: string,
    public readonly clientId: string,
    public readonly name: string,
    public readonly surname: string,
    public readonly birthDay: string,
    public readonly phone: string,
    public readonly email: string,
  ) {}
}
