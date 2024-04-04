import { IsDefined } from 'class-validator';

export class ArchiveClientDTO {
  @IsDefined()
  id: string;
}
