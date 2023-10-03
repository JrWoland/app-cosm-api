import { AppointmentStatus } from '../../domain/AppointmentStatus';

interface CardTemplate {
  name: string;
  identifier: string;
  selectedOptions: string[] | number[];
  availableOptions: string[] | number[];
  description: string;
}
interface CardDTO {
  id: string;
  name: string;
  template: CardTemplate[];
}
export interface TreatmentDTO {
  id: string;
  duration: number;
  startTime: number;
  price: number;
  card: CardDTO;
}
export interface UpdateAppointmentDTO {
  accountId: string;
  appointmentId: string;
  clientId: string;
  date: string;
  startTime: number;
  duration: number;
  treatments: TreatmentDTO[];
  status: AppointmentStatus;
}
