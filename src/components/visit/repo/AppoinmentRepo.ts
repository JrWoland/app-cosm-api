import { FilterQuery, Model } from 'mongoose';
import { AppointmentDocModel } from '../../../infra/db/models/appointmentModel';
import { AppointmentId } from '../domain/AppointmentId';
import { Appointment } from '../domain/Appointment';
import { AppointmentMap } from './mappers/AppoinmentMap';
import { AccountId } from '../../accounts/domain/AccountId';
import { startOfDay, endOfDay } from 'date-fns';
interface AppointmetsFilter {
  page: number;
  limit: number;
  satus: string;
  dateFrom: string;
  dateTo: string;
  clientId: string;
  beautyServiceId: string;
}

interface AppointmentsList {
  count: number;
  appointments: Appointment[];
}
export interface IAppoinmentRepo {
  findAppointmentByAppointmentAndAccountId(appointmentId: AppointmentId, accountId: AccountId): Promise<Appointment>;
  findAllAppoinmentsList(accountId: AccountId, filters: AppointmetsFilter): Promise<AppointmentsList>;
  exists(appointment: Appointment): Promise<boolean>;
  save(appointment: Appointment): Promise<void>;
}

export class AppoinmentRepo implements IAppoinmentRepo {
  constructor(private model: Model<AppointmentDocModel>) {}

  private dateQuery(filters: AppointmetsFilter) {
    const dateQuery = {};
    if (filters.dateFrom) Object.assign(dateQuery, { $gte: startOfDay(new Date(filters.dateFrom)) });
    if (filters.dateTo) Object.assign(dateQuery, { $lte: endOfDay(new Date(filters.dateTo)) });
    return dateQuery;
  }

  private buildQuery(accountId: AccountId, filters: AppointmetsFilter): FilterQuery<AppointmentDocModel> {
    const mongooseQuery: FilterQuery<AppointmentDocModel> = {
      account_id: accountId.id.getValue(),
    };

    if (filters.clientId) mongooseQuery.client_id = filters.clientId;

    if (filters.beautyServiceId) mongooseQuery['services._id'] = { $in: [filters.beautyServiceId] };

    if (filters.dateFrom || filters.dateTo) mongooseQuery.date = this.dateQuery(filters);

    if (filters.satus) mongooseQuery.status = { $regex: new RegExp(filters.satus || '', 'i') };

    return mongooseQuery;
  }

  public async count(accountId: AccountId, filters: AppointmetsFilter): Promise<number> {
    try {
      const numberOfappointments = await this.model.count(this.buildQuery(accountId, filters));
      return numberOfappointments;
    } catch (error) {
      throw new Error(`Could not count appointments: ${error}`);
    }
  }

  public async findAppointmentByAppointmentAndAccountId(appointmentId: AppointmentId, accountId: AccountId): Promise<Appointment> {
    try {
      const appointment = await this.model.findOne({ _id: appointmentId.value.toString(), account_id: accountId.id.getValue() });

      if (!appointment) {
        throw new Error(`Appointment with id=${appointmentId.value.toString()} does not exists.`);
      }
      return new AppointmentMap().toDomain(appointment);
    } catch (error) {
      throw new Error('Can not find appointment by appointmentId. ' + error.message);
    }
  }

  public async findAllAppoinmentsList(accountId: AccountId, filters: AppointmetsFilter): Promise<AppointmentsList> {
    try {
      const result = await this.model
        .find(this.buildQuery(accountId, filters))
        .limit(filters.limit * 1)
        .skip((filters.page - 1) * filters.limit);
      // .sort({ date: 'asc' });

      const count = await this.count(accountId, filters);
      const appointmentsList = result.map((appointment) => new AppointmentMap().toDomain(appointment));

      return { count, appointments: appointmentsList };
    } catch (error) {
      throw new Error(`Can not find appointments: ${error}`);
    }
  }

  public async exists(appointment: Appointment): Promise<boolean> {
    try {
      const apointmentId = appointment.appointmentId.value;
      const accountId = appointment.accountId.id.getValue();
      const appoinmentExists = await this.model.exists({ _id: apointmentId, account_id: accountId });
      return appoinmentExists;
    } catch (error) {
      throw new Error(`Can not check if appoinment with id ${appointment.appointmentId.value} exists.`);
    }
  }

  public async save(appointment: Appointment): Promise<void> {
    try {
      const appointmentToSave = new AppointmentMap().toPersistence(appointment);

      const exists = await this.exists(appointment);

      if (!exists) {
        const newAppoinment = new this.model(appointmentToSave);
        await newAppoinment.save();
      } else {
        const apointmentId = appointment.appointmentId.value;
        const accountId = appointment.accountId.id.getValue();
        const result = await this.model.updateOne(
          {
            _id: apointmentId,
            account_id: accountId,
          },
          appointmentToSave,
        );

        if (result.nModified === 0) throw Error(`Appointment with id: ${appointment.appointmentId.value} was not modified.`);
      }
    } catch (error) {
      throw new Error('Can not save appoinment: ' + error);
    }
  }
}
