import { AppointmentModel } from 'src/db/mongoose/appointment.sheema';

import { Mapper } from 'src/shared/Mapper';
import { AppointmentDetails } from '../../domain/appointment/AppointmentDetails';
import { AppointmentId } from '../../domain/appointment/AppointmentId';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { AppointmentDate } from '../../domain/appointment/AppointmentDate';
import { AppointmentDuration } from '../../domain/appointment/AppointmentDuration';
import { AppointmentStartTime } from '../../domain/appointment/AppointmentStartTime';
import { AppointmentStatus } from '../../domain/appointment/AppointmentStatus';
import { AppointmentClientDetails } from '../../domain/appointment/AppointmentClientDetails';
import { ClientId } from '../../domain/client/ClientId';
import { AppointmentTreatment } from '../../domain/appointment/AppointmentTreatmentDetails';
import { TreatmentId } from '../../domain/treatment/TreatmentId';

export class AppoinmentDetailsMap implements Mapper<AppointmentDetails, AppointmentModel> {
  toDomain(raw: AppointmentModel): AppointmentDetails {
    const treatments = raw.services.map((service) =>
      AppointmentTreatment.create({
        name: service.treatment_details.name || service.name,
        duration: service.duration,
        startTime: service.start_time,
        treatmentId: TreatmentId.create(new UniqueEntityID(service.treatment_details._id)),
      }),
    );

    return AppointmentDetails.create({
      id: AppointmentId.create(new UniqueEntityID(raw._id)),
      date: AppointmentDate.create(raw.date.toISOString()),
      duration: AppointmentDuration.create(raw.duration),
      startTime: AppointmentStartTime.create(raw.start_time),
      status: AppointmentStatus.create(raw.status),
      clientDetails: AppointmentClientDetails.create({
        id: ClientId.create(new UniqueEntityID(raw.client_details._id)),
        name: raw.client_details.name,
        surname: raw.client_details.surname,
      }),
      services: treatments,
    });
  }
}
