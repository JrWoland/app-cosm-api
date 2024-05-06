import { AppointmentDate } from './AppointmentDate';
import { AppointmentDuration } from './AppointmentDuration';
import { AppointmentStartTime } from './AppointmentStartTime';
import { AppointmentStatus } from './AppointmentStatus';
import { AppointmentTreatment } from './AppointmentTreatmentDetails';
import { AppointmentId } from './AppointmentId';

import { ValueObject } from 'src/shared/ValueObject';
import { AppointmentClientDetails } from './AppointmentClientDetails';

interface IAppointmentDetailsProps {
  readonly id: AppointmentId;
  readonly clientDetails: AppointmentClientDetails | null;
  readonly date: AppointmentDate;
  readonly duration: AppointmentDuration;
  readonly startTime: AppointmentStartTime;
  readonly status: AppointmentStatus;
  readonly services: AppointmentTreatment[] | null;
}

export class AppointmentDetails extends ValueObject<IAppointmentDetailsProps> {
  private constructor(private appointmentDetails: IAppointmentDetailsProps) {
    super(appointmentDetails);
  }

  get id() {
    return this.appointmentDetails.id;
  }

  get clientDetails() {
    return this.appointmentDetails?.clientDetails?.value || null;
  }

  get date() {
    return this.appointmentDetails.date;
  }

  get duration() {
    return this.appointmentDetails.duration;
  }

  get startTime() {
    return this.appointmentDetails.startTime;
  }

  get status() {
    return this.appointmentDetails.status;
  }

  get services() {
    return this.appointmentDetails.services;
  }

  public static create(props: IAppointmentDetailsProps): AppointmentDetails {
    return new AppointmentDetails(props);
  }
}
