import { AppointmentStatus } from '../../domain/AppointmentStatus';

export interface UpdateAppointmentDTO {
  accountId: string;
  appointmentId: string;
  clientId?: string | null | undefined;
  date: Date;
  startTime: number;
  duration: number;
  treatments: string[];
  status: AppointmentStatus;
}
