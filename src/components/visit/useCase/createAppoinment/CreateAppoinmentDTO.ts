import { AppointmentStatus } from '../../domain/AppointmentStatus';

export interface TreatmentDTO {
  id: string;
  duration: number;
  startTime: number;
  cardTemplate: unknown;
}
export interface CreateAppoinmentDTO {
  accountId: string;
  date: Date;
  clientId?: string | null | undefined;
  startTime: number;
  duration: number;
  status: AppointmentStatus;
  treatments: TreatmentDTO[];
}
