import { AccountId } from 'src/modules/account/domain/AccountId';
import { Appointment } from './Appointment';
import { AppointmentId } from './AppointmentId';

export interface IAppointmetsFilter {
  page: number;
  limit: number;
  status: string;
  dateFrom: string;
  dateTo: string;
  clientId: string;
  beautyServiceId: string;
}

export interface IAppointmentsList {
  count: number;
  appointments: Appointment[];
}

export interface IDeleteResult {
  id: string;
  message: string;
  success: boolean;
}

export interface IAppoinmentRepo {
  findAppointmentById(appointmentId: AppointmentId, accountId: AccountId): Promise<Appointment>;
  findAllAppoinmentsList(accountId: AccountId, filters: IAppointmetsFilter): Promise<IAppointmentsList>;
  deleteOne(appointmentId: AppointmentId, accountId: AccountId): Promise<IDeleteResult>;
  count(accountId: AccountId, filters: IAppointmetsFilter): Promise<number>;
  exists(appointment: Appointment): Promise<boolean>;
  save(appointment: Appointment): Promise<void>;
}
