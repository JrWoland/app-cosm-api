export class CreateTreatmentCommand {
  constructor(
    public readonly accountId: string,
    public readonly name: string,
    public readonly price: number,
    public readonly duration: number,
    public readonly description?: string,
    public readonly defaultCardId?: string,
  ) {}
}
