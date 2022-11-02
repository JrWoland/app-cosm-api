import { Model } from 'mongoose';
import { AppointmentDocModel } from '../../../infra/db/models/appointmentModel';
import { AppointmentId } from '../domain/AppointmentId';
import { Appointment } from '../domain/Appointment';
import { AppointmentMap } from './mappers/AppoinmentMap';
import { AccountId } from '../../accounts/domain/AccountId';

export interface IAppoinmentRepo {
  findAppointmentByAppointmentAndAccountId(appointmentId: AppointmentId, accountId: AccountId): Promise<Appointment>;
  exists(appointment: Appointment): Promise<boolean>;
  save(appointment: Appointment): Promise<void>;
}

export class AppoinmentRepo implements IAppoinmentRepo {
  constructor(private model: Model<AppointmentDocModel>) {}

  public async findAppointmentByAppointmentAndAccountId(appointmentId: AppointmentId, accountId: AccountId): Promise<Appointment> {
    try {
      const appoinment = await this.model.findOne({ _id: appointmentId.value.toString(), account_id: accountId.id.getValue() });

      if (!appoinment) {
        throw new Error(`Appointment with id ${appointmentId.value.toString()} does not exists.`);
      }
      return new AppointmentMap().toDomain(appoinment);
    } catch (error) {
      throw new Error('Can not find appoinment by appoinmentId.');
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
