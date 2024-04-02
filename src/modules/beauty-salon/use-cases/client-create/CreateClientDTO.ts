import { IsDefined } from 'class-validator';

export class CreateClientDTO {
  @IsDefined()
  public readonly name: string;

  @IsDefined()
  public readonly surname: string;

  public readonly birthDay?: string;

  public readonly phone?: string;

  public readonly email?: string;
}
