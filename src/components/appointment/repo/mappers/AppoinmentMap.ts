import { Mapper } from '../../../../core/infra/Mapper';
import { AppointmentDocModel } from '../../../../infra/db/models/appointmentModel';
import { Appointment } from '../../domain/Appointment';
import { AccountId } from '../../../accounts/domain/AccountId';
import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { ClientId } from '../../../clients/domain/ClientId';
import { AppointmentStatus } from '../../domain/AppointmentStatus';

export class AppointmentMap implements Mapper<Appointment, AppointmentDocModel> {
  toPersistence(appointment: Appointment): AppointmentDocModel {
    return {
      _id: appointment.appointmentId.value,
      account_id: appointment.props.accountId.id.getValue(),
      client_id: appointment.props.clientId?.clientId.getValue(),
      date: appointment.props.date,
      duration: appointment.props.duration,
      start_time: appointment.props.startTime,
      status: appointment.props.status,
      services: appointment.props.treatments,
    };
  }

  toDomain(raw: AppointmentDocModel): Appointment {
    const accountId = AccountId.create(new UniqueEntityID(raw.account_id));
    const clientId = ClientId.create(new UniqueEntityID(raw.client_id));

    const appointment = Appointment.create(
      {
        accountId: accountId.getValue(),
        clientId: raw.client_id ? clientId.getValue() : null,
        status: raw.status as AppointmentStatus,
        date: raw.date,
        duration: raw.duration,
        startTime: raw.start_time,
        treatments: raw.services,
      },
      new UniqueEntityID(raw._id),
    );

    return appointment.getValue();
  }
}
