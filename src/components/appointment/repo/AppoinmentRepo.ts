import { Model } from 'mongoose';
import { AppointmentDocModel } from '../../../infra/db/models/appointmentModel';
import { AppointmentId } from '../domain/AppointmentId';
import { Appointment } from '../domain/Appointment';
import { AppointmentMap } from './mappers/AppoinmentMap';

export interface IAppoinmentRepo {
  findAppointmentByAppointmentId(appointmentId: AppointmentId): Promise<Appointment>;
  exists(appointmentId: AppointmentId): Promise<boolean>;
  save(appointmentId: Appointment): Promise<void>;
}

export class AppoinmentRepo implements IAppoinmentRepo {
  constructor(private model: Model<AppointmentDocModel>) {}

  public async findAppointmentByAppointmentId(appointmentId: AppointmentId): Promise<Appointment> {
    try {
      const appoinment = await this.model.find({ _id: appointmentId.value.toString() });

      if (appoinment.length === 0) {
        throw new Error('Appoinment does not exists.');
      }
      return new AppointmentMap().toDomain(appoinment[0]);
    } catch (error) {
      throw new Error('Can not find appoinment by appoinmentId.');
    }
  }

  public async exists(appointmentId: AppointmentId): Promise<boolean> {
    try {
      const appoinmentExists = await this.model.exists({ _id: appointmentId.value });
      return appoinmentExists;
    } catch (error: any) {
      throw new Error('Can not check if appoinment exists.');
    }
  }

  public async save(appointment: Appointment): Promise<void> {
    try {
      const appointmentToSave = new AppointmentMap().toPersistence(appointment);

      const exists = await this.model.exists({ _id: appointment.appointmentId.value });

      if (!exists) {
        const newAppoinment = new this.model(appointmentToSave);
        await newAppoinment.save();
      } else {
        await this.model.findOneAndUpdate(
          {
            _id: appointment.appointmentId.value,
          },
          appointmentToSave,
        );
      }
    } catch (error) {
      throw new Error('Can not save appoinment: ' + error);
    }
  }
}
