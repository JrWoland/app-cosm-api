import { IsDefined } from 'class-validator';

export class ActivateClientDTO {
  @IsDefined()
  id: string;
}
