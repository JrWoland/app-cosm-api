import { AppointmentDate } from './AppointmentDate';
import { AppointmentDuration } from './AppointmentDuration';
import { AppointmentStartTime } from './AppointmentStartTime';
import { AppointmentStatus } from './AppointmentStatus';
import { AppointmentTreatment } from './AppointmentTreatmentDetails';
import { AppointmentId } from './AppointmentId';
import { UnprocessableEntityException } from '@nestjs/common';
import { ValueObject } from 'src/shared/ValueObject';
import { AppointmentClientDetails } from './AppointmentClientDetails';

interface IAppointmentDetailsProps {
  readonly id: AppointmentId;
  readonly clientDetails: AppointmentClientDetails;
  readonly date: AppointmentDate;
  readonly duration: AppointmentDuration;
  readonly startTime: AppointmentStartTime;
  readonly status: AppointmentStatus;
  readonly services: AppointmentTreatment[];
}

export class AppointmentDetails extends ValueObject<IAppointmentDetailsProps> {
  private constructor(private appointmentDetails: IAppointmentDetailsProps) {
    super(appointmentDetails);
  }

  get id() {
    return this.appointmentDetails.id;
  }

  get clientDetails() {
    return this.appointmentDetails.clientDetails;
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
    const { services } = props;

    if (services.length <= 0) throw new UnprocessableEntityException('Cannot create appointments details without treatments.');

    return new AppointmentDetails(props);
  }
}
