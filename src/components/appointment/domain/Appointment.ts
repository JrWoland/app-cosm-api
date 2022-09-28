import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Result } from '../../../core/logic/Result';
import { AccountId } from '../../accounts/domain/AccountId';
import { ClientId } from '../../clients/domain/ClientId';
import { AppointmentId } from './AppointmentId';
import { AppointmentStatus } from './AppointmentStatus';
import { TreatmentId } from '../../treatment/domain/TreatmentId';

interface AppointmentProps {
  accountId: AccountId;
  clientId?: ClientId | null;
  date: Date;
  startTime: number;
  duration: number;
  status: AppointmentStatus;
  treatments: TreatmentId[];
}

type Minutes = number;

export class Appointment extends AggregateRoot<AppointmentProps> {
  private constructor(props: AppointmentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get appointmentId(): AppointmentId {
    return AppointmentId.create(this._uniqueEntityId).getValue();
  }

  get accountId() {
    return this.props.accountId;
  }

  get clientId() {
    return this.props.clientId;
  }

  get date() {
    return this.props.date;
  }

  get startTime() {
    return this.props.startTime;
  }

  get duration() {
    return this.props.duration;
  }

  get status() {
    return this.props.status;
  }

  get treatments() {
    return this.props.treatments;
  }

  private static isAppoinmentStatusValid(status: AppointmentStatus): boolean {
    return [AppointmentStatus.ClientNotAppeard, AppointmentStatus.Declined, AppointmentStatus.Finished, AppointmentStatus.New].includes(status);
  }

  private static validator(props: Omit<AppointmentProps, 'accountId'>): Result<Appointment | boolean> {
    const validation: string[] = [];
    props.duration > 0 ? true : validation.push('Duration must be grater than 0.');
    props.startTime > 0 ? true : validation.push('Start time must be grater than 0.');
    props.date ? true : validation.push('Appoinment date must be provided.');
    this.isAppoinmentStatusValid(props.status) ? true : validation.push(`Status is not valid: ${props.status}.`);
    if (validation.length) {
      return Result.fail<Appointment>(validation.join(' '));
    }
    return Result.ok(true);
  }

  public setAppointmentStatus(status: AppointmentStatus): Result<string> {
    if (!Appointment.isAppoinmentStatusValid(status)) {
      const error = Result.fail<string>('Invalid appoinment status.');
      this.registerError(error);
      return error;
    }
    this.props.status = status;
    return Result.ok<string>('Appoinment status changed successfully.');
  }

  public setAppointmentDate(date: Date) {
    if (!(date instanceof Date)) {
      const error = Result.fail<string>('Date must be instance of Date.');
      this.registerError(error);
      return error;
    }
    this.props.date = date;
    return Result.ok<string>('Appointment date changed successfully');
  }

  public setAppointmentDuration(duration: Minutes): Result<string> {
    if (duration <= 0) {
      const error = Result.fail<string>('Duration must be bigger than 0.');
      this.registerError(error);
      return error;
    }
    this.props.duration = duration;
    return Result.ok<string>('Duration changed successfully');
  }

  public setAppointmentStartTime(startTime: Minutes): Result<string> {
    if (startTime <= 0) {
      const error = Result.fail<string>('Start time must be bigger than 0.');
      this.registerError(error);
      return error;
    }
    this.props.startTime = startTime;
    return Result.ok<string>('Appointment staring time changed successfully.');
  }

  public setAppointmentClientId(clientId?: ClientId | null | undefined): Result<string> {
    this.props.clientId = clientId;
    return Result.ok<string>('Client id has been changed.');
  }

  public addTreatment(treatment: TreatmentId): Result<string> {
    this.props.treatments.push(treatment);
    return Result.ok<string>('Treatment added.');
  }

  public removeTreatment(treatmentId: TreatmentId): Result<string> {
    if (this.props.treatments.length === 0) return Result.fail<string>('No treatments.');
    this.props.treatments = this.props.treatments.filter((t) => t.value !== treatmentId.value);
    return Result.ok<string>('Treatment has been removed.');
  }

  public updateAll(data: Omit<AppointmentProps, 'accountId'>): Result<Appointment | string> {
    const validationResult = Appointment.validator(data);

    if (validationResult.isFailure) {
      return Result.fail<Appointment>(validationResult.error);
    }

    this.setAppointmentDuration(data.duration);
    this.setAppointmentStartTime(data.startTime);
    this.setAppointmentDate(data.date);
    this.setAppointmentClientId(data.clientId);
    this.setAppointmentStatus(data.status);
    this.props.treatments = data.treatments;

    return Result.ok<string>('Appointment updated successfully.');
  }

  public static create(props: AppointmentProps, id?: UniqueEntityID): Result<Appointment> {
    const validationResult = this.validator(props);

    if (validationResult.isFailure) {
      return Result.fail<Appointment>(validationResult.error);
    }

    const appointment = new Appointment(
      {
        accountId: props.accountId,
        clientId: props.clientId,
        date: props.date,
        duration: props.duration,
        startTime: props.startTime,
        status: props.status,
        treatments: props.treatments,
      },
      id,
    );

    return Result.ok<Appointment>(appointment);
  }
}
