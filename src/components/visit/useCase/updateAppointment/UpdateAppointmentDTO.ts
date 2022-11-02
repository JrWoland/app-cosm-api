import { AppointmentStatus } from '../../domain/AppointmentStatus';

interface TreatmentDTO {
  id: string;
  duration: number;
  startTime: number;
  cardTemplate: unknown;
}

export interface UpdateAppointmentDTO {
  accountId: string;
  appointmentId: string;
  clientId?: string | null | undefined;
  date: string;
  startTime: number;
  duration: number;
  treatments: TreatmentDTO[];
  status: AppointmentStatus;
}
