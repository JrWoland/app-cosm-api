import { AggregateRoot } from '@nestjs/cqrs';
import { AppointmentDate } from './AppointmentDate';
import { AppointmentDuration } from './AppointmentDuration';
import { AppointmentStartTime } from './AppointmentStartTime';
import { AppointmentStatus } from './AppointmentStatus';
import { AppointmentTreatment } from './AppointmentTreatmentDetails';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { ClientId } from '../client/ClientId';
import { AppointmentId } from './AppointmentId';
import { UnprocessableEntityException } from '@nestjs/common';

interface IAppointmentProps {
  readonly id: AppointmentId;
  readonly accountId: AccountId;
  readonly clientId: ClientId;
  readonly date: AppointmentDate;
  readonly startTime: AppointmentStartTime;
  readonly status: AppointmentStatus;
  readonly services: AppointmentTreatment[];
}

export class Appointment extends AggregateRoot {
  private constructor(
    private _id: AppointmentId,
    private _accountId: AccountId,
    private _clientId: ClientId,
    private _date: AppointmentDate,
    private _startTime: AppointmentStartTime,
    private _status: AppointmentStatus,
    private _treatments: AppointmentTreatment[],
  ) {
    super();
  }

  public get id(): AppointmentId {
    return this._id;
  }

  public get accountId(): AccountId {
    return this._accountId;
  }

  public get clientId(): ClientId {
    return this._clientId;
  }

  public get date(): AppointmentDate {
    return this._date;
  }

  public get startTime(): AppointmentStartTime {
    return this._startTime;
  }

  public get status(): AppointmentStatus {
    return this._status;
  }

  public get treatments(): readonly AppointmentTreatment[] {
    return this._treatments;
  }

  public get duration(): AppointmentDuration {
    const result = this._treatments.reduce((prev, current) => (prev += current.duration), 0);
    return AppointmentDuration.create(result);
  }

  public addService(service: AppointmentTreatment): void {
    this._treatments.push(service);
  }

  public static create(props: IAppointmentProps): Appointment {
    const { id, accountId, clientId, date, services, startTime, status } = props;

    if (services.length <= 0) throw new UnprocessableEntityException('Cannot create appointments without treatments.');
    if (!accountId) throw new UnprocessableEntityException('Cannot create appointments without accountId.');
    if (!clientId) throw new UnprocessableEntityException('Cannot create appointments without clientId.');

    return new Appointment(id, accountId, clientId, date, startTime, status, services);
  }
}
