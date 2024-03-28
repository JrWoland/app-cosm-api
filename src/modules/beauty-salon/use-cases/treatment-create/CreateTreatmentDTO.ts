import { IsDefined } from 'class-validator';

export class CreateTreatmentDTO {
  @IsDefined()
  public readonly name: string;

  @IsDefined()
  public readonly price: number;

  @IsDefined()
  public readonly duration: number;

  public readonly description?: string;

  public readonly defaultCardId?: string;
}
