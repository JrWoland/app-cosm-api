import { IsDefined } from 'class-validator';

export class ArchiveTreatmentDTO {
  @IsDefined()
  id: string;
}
