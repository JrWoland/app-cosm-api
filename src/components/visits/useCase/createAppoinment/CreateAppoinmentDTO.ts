import { AppointmentStatus } from '../../domain/AppointmentStatus';

export interface CreateAppoinmentDTO {
  date: Date;
  clientId: string;
  startTime: number;
  duration: number;
  treatments: [];
}
