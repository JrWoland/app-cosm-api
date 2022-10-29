import { Mapper } from '../../../../core/infra/Mapper';
import { AppointmentDocModel } from '../../../../infra/db/models/appointmentModel';
import { Appointment } from '../../domain/Appointment';
import { AccountId } from '../../../accounts/domain/AccountId';
import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { ClientId } from '../../../clients/domain/ClientId';
import { AppointmentStatus } from '../../domain/AppointmentStatus';
import { Treatments } from '../../domain/Treatments';
import { TreatmentMap } from './TreatmentMap';

export class AppointmentMap implements Mapper<Appointment, AppointmentDocModel> {
  toPersistence(appointment: Appointment): AppointmentDocModel {
    const trs = appointment.treatments.list.map((tr) => new TreatmentMap().toPersistence(tr));

    return {
      _id: appointment.appointmentId.value,
      account_id: appointment.accountId.id.getValue(),
      client_id: appointment.clientId?.clientId.getValue(),
      date: appointment.date,
      duration: appointment.duration,
      start_time: appointment.startTime,
      status: appointment.status,
      services: trs,
    };
  }

  toDomain(raw: AppointmentDocModel): Appointment {
    const accountId = AccountId.create(new UniqueEntityID(raw.account_id));
    const clientId = ClientId.create(new UniqueEntityID(raw.client_id));
    const treatments = raw.services.map((item) => new TreatmentMap().toDomain(item));

    const appointment = Appointment.create(
      {
        accountId: accountId.getValue(),
        clientId: raw.client_id ? clientId.getValue() : null,
        status: raw.status as AppointmentStatus,
        date: raw.date,
        duration: raw.duration,
        startTime: raw.start_time,
        treatments: Treatments.create(treatments),
      },
      new UniqueEntityID(raw._id),
    );

    return appointment.getValue();
  }
}
