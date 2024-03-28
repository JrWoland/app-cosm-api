import { AppointmentModel } from 'src/db/mongoose/appointment.sheema';

import { Mapper } from 'src/shared/Mapper';
import { Appointment } from '../../domain/appointment/Appointment';
import { AppointmentId } from '../../domain/appointment/AppointmentId';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { ClientId } from '../../domain/client/ClientId';
import { AppointmentDate } from '../../domain/appointment/AppointmentDate';
import { AppointmentStartTime } from '../../domain/appointment/AppointmentStartTime';
import { AppointmentStatus } from '../../domain/appointment/AppointmentStatus';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { AppointmentTreatment } from '../../domain/appointment/AppointmentTreatment';
import { TreatmentId } from '../../domain/treatment/TreatmentId';

export class AppointmentMap implements Mapper<Appointment, AppointmentModel> {
  // toPersistence(appointment: Appointment): AppointmentModel {
  //   const treatments = appointment.treatments.map(({ duration, startTime, treatmentId, name }) => ({
  //     name,
  //     treatment_details: treatmentId.value,
  //     duration: duration,
  //     start_time: startTime,
  //     card_template: null,
  //   })); // mapper for treatments
  //   return {
  //     _id: appointment.id.value,
  //     account_id: appointment.accountId.value,
  //     client_details: appointment.clientId.value,
  //     date: appointment.date.value,
  //     duration: appointment.duration.value,
  //     start_time: appointment.startTime.value,
  //     status: appointment.status.value,
  //     services: treatments,
  //   };
  // }

  toDomain(raw: AppointmentModel): Appointment {
    const treatments = raw.services.map((service) =>
      AppointmentTreatment.create({
        name: service.treatment_details.name || service.name,
        duration: service.duration,
        startTime: service.start_time,
        treatmentId: TreatmentId.create(new UniqueEntityID(service.treatment_details._id)),
      }),
    );

    const appointment = Appointment.create({
      id: AppointmentId.create(new UniqueEntityID(String(raw._id))),
      accountId: AccountId.create(new UniqueEntityID(raw.account_id)),
      clientId: ClientId.create(new UniqueEntityID(raw._id)),
      date: AppointmentDate.create(raw.date.toISOString()),
      startTime: AppointmentStartTime.create(raw.start_time),
      status: AppointmentStatus.create(raw.status),
      services: treatments,
    });

    return appointment;
  }
}
