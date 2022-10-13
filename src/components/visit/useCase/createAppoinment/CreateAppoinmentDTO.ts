import { AppointmentStatus } from '../../domain/AppointmentStatus';

export interface CreateAppoinmentDTO {
  accountId: string;
  date: Date;
  clientId?: string | null | undefined;
  startTime: number;
  duration: number;
  status: AppointmentStatus;
  treatments: [];
}
