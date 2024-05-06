import { IsDefined } from 'class-validator';

export class CreateCardDTO {
  @IsDefined()
  public readonly clientId: string;

  @IsDefined()
  public readonly date: string;

  @IsDefined()
  public readonly template: Record<string, unknown>;

  public readonly appointmentId?: string;
}
