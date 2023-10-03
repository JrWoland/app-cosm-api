import { Mapper } from '../../../../core/infra/Mapper';
import { AppointmentDocModel } from '../../../../infra/db/models/appointmentModel';
import { Appointment } from '../../domain/Appointment';
import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { Treatments } from '../../domain/Treatments';
import { TreatmentMap } from './TreatmentMap';

export class AppointmentMap implements Mapper<Appointment, AppointmentDocModel> {
  toPersistence(appointment: Appointment): AppointmentDocModel {
    const treatments = appointment.treatments.list.map((tr) => new TreatmentMap().toPersistence(tr));

    return {
      _id: appointment.appointmentId.value,
      account_id: appointment.accountId.id.getValue(),
      client_id: appointment.clientId?.value,
      date: appointment.date,
      duration: appointment.duration.value,
      start_time: appointment.startTime.value,
      status: appointment.status.value,
      services: treatments,
    };
  }

  toDomain(raw: AppointmentDocModel): Appointment {
    const treatments = raw.services.map((item) => new TreatmentMap().toDomain(item));

    const appointment = Appointment.create(
      {
        accountId: raw.account_id,
        clientId: raw.client_id,
        status: raw.status,
        date: raw.date.toISOString(),
        duration: raw.duration,
        startTime: raw.start_time,
        treatments: Treatments.create(treatments),
      },
      new UniqueEntityID(raw._id),
    );

    return appointment.getValue();
  }
}
