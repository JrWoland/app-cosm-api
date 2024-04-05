import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment } from '../domain/appointment/Appointment';
import { AppointmentModel } from 'src/db/mongoose/appointment.sheema';
import { FilterQuery, Model } from 'mongoose';
import { AppointmentMap } from './mappers/AppoinmentMap';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { AppointmentId } from '../domain/appointment/AppointmentId';
import dayjs from 'dayjs';
import { IAppoinmentRepo, IAppointmetsFilter, IDeleteResult, IAppointmentsList } from '../domain/appointment/IAppointmentRepo';
import { AppoinmentDetailsMap } from './mappers/AppoinmentDetailsMap';

@Injectable()
export class AppointmentRepository implements IAppoinmentRepo {
  constructor(@InjectModel(AppointmentModel.name) private model: Model<AppointmentModel>) {}

  public async findAppointmentById(appointmentId: AppointmentId, accountId: AccountId): Promise<Appointment> {
    try {
      const appointment = await this.model.findOne({ _id: appointmentId.value, account_id: accountId.value });

      if (!appointment) {
        throw new UnprocessableEntityException(`Cannot find the entity: ${appointmentId}`);
      }

      return new AppointmentMap().toDomain(appointment);
    } catch (error) {
      throw new InternalServerErrorException(`Internal server error: Could not find appointment: ${appointmentId}`);
    }
  }

  private dateQuery(filters: IAppointmetsFilter) {
    const dateQuery = {};
    if (filters.dateFrom) Object.assign(dateQuery, { $gte: dayjs(new Date(filters.dateFrom)).startOf('day') });
    if (filters.dateTo) Object.assign(dateQuery, { $lte: dayjs(new Date(filters.dateTo)).endOf('day') });
    return dateQuery;
  }

  private buildQuery(accountId: AccountId, filters: IAppointmetsFilter): FilterQuery<AppointmentModel> {
    const mongooseQuery: FilterQuery<AppointmentModel> = {
      account_id: accountId.value,
    };

    if (filters.clientId) mongooseQuery.client_id = filters.clientId;

    if (filters.beautyServiceId) mongooseQuery['services._id'] = { $in: [filters.beautyServiceId] };

    if (filters.dateFrom || filters.dateTo) mongooseQuery.date = this.dateQuery(filters);

    if (filters.status !== undefined) mongooseQuery.status = { $regex: new RegExp(filters.status || '', 'i') };

    return mongooseQuery;
  }

  public async count(accountId: AccountId, filters: IAppointmetsFilter): Promise<number> {
    try {
      const query = this.buildQuery(accountId, filters);
      const numberOfappointments = await this.model.countDocuments(query);
      return numberOfappointments;
    } catch (error) {
      throw new InternalServerErrorException(`Could not count appointments: ${error}`);
    }
  }

  public async findAllAppoinmentsList(accountId: AccountId, filters: IAppointmetsFilter): Promise<IAppointmentsList> {
    try {
      const result = await this.model
        .find(this.buildQuery(accountId, filters))
        .populate({ path: 'client_details', select: 'name surname' })
        .populate({ path: 'services.treatment_details', select: 'name' })
        .limit(filters.limit * 1)
        .skip((filters.page - 1) * filters.limit)
        .sort({ date: 'desc' });

      const count = await this.count(accountId, filters);
      const appointmentsList = result.map((appointment) => new AppoinmentDetailsMap().toDomain(appointment));

      return { count, appointments: appointmentsList };
    } catch (error) {
      throw new InternalServerErrorException(`Can not find appointments: ${error}`);
    }
  }

  public async deleteOne(appointmentId: AppointmentId, accountId: AccountId): Promise<IDeleteResult> {
    try {
      const appointment = await this.model.deleteOne({ _id: appointmentId.value, account_id: accountId.value });

      if (appointment.deletedCount === 0) {
        throw new NotFoundException(null, { description: 'Appointment not found.' });
      }

      return { id: appointmentId.value, message: 'Appointment permanently deleted.', success: true };
    } catch (error) {
      throw new InternalServerErrorException('Can not delete appointment by appointmentId. ' + error);
    }
  }

  public async exists(appointment: Appointment): Promise<boolean> {
    try {
      const doc = await this.model.exists({ _id: appointment.id.value, account_id: appointment.accountId.value });
      return !!doc;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async save(appointment: Appointment): Promise<void> {
    try {
      const appointmentToSave = {
        _id: appointment.id.value,
        account_id: appointment.accountId.value,
        client_details: appointment.clientId.value,
        date: appointment.date.value,
        duration: appointment.duration.value,
        status: appointment.status.value,
        start_time: appointment.startTime.value,
        services: appointment.treatments.map(({ duration, name, startTime, treatmentId }) => ({
          treatment_details: treatmentId.value,
          duration,
          name,
          start_time: startTime,
        })),
      };

      const exists = await this.exists(appointment);

      if (!exists) {
        const newAppoinment = new this.model(appointmentToSave);
        await newAppoinment.save();
      } else {
        const apointmentId = appointment.id.value;
        const accountId = appointment.accountId.value;
        const result = await this.model.updateOne(
          {
            _id: apointmentId,
            account_id: accountId,
          },
          appointmentToSave,
        );

        if (result.modifiedCount === 0) throw new UnprocessableEntityException(`Appointment with id: ${appointment.id.value} was not modified.`);
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
