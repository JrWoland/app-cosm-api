import { IsDefined } from 'class-validator';

export class EditTreatmentDetailsDTO {
  @IsDefined()
  public readonly id: string;

  public readonly name: string;

  public readonly price: number;

  public readonly duration: number;

  public readonly defaultCardId: string;
}
