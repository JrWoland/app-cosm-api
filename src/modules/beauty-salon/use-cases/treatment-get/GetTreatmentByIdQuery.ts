export class GetTreatmentByIdQuery {
  constructor(
    public readonly accountId: string,
    public readonly treatmentId: string,
  ) {}
}
