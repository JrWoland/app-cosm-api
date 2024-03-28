import { IsDefined } from 'class-validator';

export class RemoveAppoinmentDTO {
  @IsDefined()
  id: string;
}
