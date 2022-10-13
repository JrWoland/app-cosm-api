import { AppointmentStatus } from '../../domain/AppointmentStatus';
import { TreatmentId } from '../../domain/TreatmentId';

export interface UpdateAppointmentDTO {
  accountId: string;
  appointmentId: string;
  clientId?: string | null | undefined;
  date: Date;
  startTime: number;
  duration: number;
  treatments: TreatmentId[];
  status: AppointmentStatus;
}
