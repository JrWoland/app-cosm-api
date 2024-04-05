export class EditTreatmentDetailsCommand {
  constructor(
    public readonly accountId: string,
    public readonly treatmentId: string,
    public readonly name: string,
    public readonly price: number,
    public readonly duration: number,
    public readonly defaultCardId: string,
  ) {}
}
