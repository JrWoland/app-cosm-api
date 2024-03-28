import { IsArray, IsDefined } from 'class-validator';

export class TreatmentDTO {
  @IsDefined()
  id: string;

  @IsDefined()
  duration: number;

  @IsDefined()
  startTime: number;
}
export class CreateAppoinmentDTO {
  @IsDefined()
  date: string;

  @IsDefined()
  clientId: string;

  @IsDefined()
  startTime: number;

  @IsDefined()
  status: string;

  @IsArray()
  treatments: TreatmentDTO[];
}
