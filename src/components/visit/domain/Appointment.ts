import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Result } from '../../../core/logic/Result';
import { AccountId } from '../../accounts/domain/AccountId';
import { ClientId } from '../../clients/domain/ClientId';
import { AppointmentId } from './AppointmentId';
import { AppointmentStatus } from './AppointmentStatus';
import { Treatment } from './Treatment';
import { Treatments } from './Treatments';

interface AppointmentProps {
  accountId: AccountId;
  clientId?: ClientId | null;
  duration: number;
  date: Date;
  startTime: number;
  status: AppointmentStatus;
  treatments: Treatments;
}

type Minutes = number;

export class Appointment extends AggregateRoot<AppointmentProps> {
  private constructor(readonly props: AppointmentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public get appointmentId(): AppointmentId {
    return AppointmentId.create(this._uniqueEntityId).getValue();
  }

  public get accountId() {
    return this.props.accountId;
  }

  public get clientId() {
    return this.props.clientId;
  }

  public get date() {
    return this.props.date;
  }

  public get startTime() {
    return this.props.startTime;
  }

  public get duration() {
    return this.props.duration;
  }

  public get status() {
    return this.props.status;
  }

  public get treatments() {
    return this.props.treatments;
  }

  private static isAppoinmentStatusValid(status: AppointmentStatus): boolean {
    return [AppointmentStatus.ClientNotAppeard, AppointmentStatus.Declined, AppointmentStatus.Finished, AppointmentStatus.New].includes(status);
  }

  private static validator(props: Omit<AppointmentProps, 'accountId'>): Result<Appointment | boolean> {
    const validation: string[] = [];
    props.duration > 0 ? true : validation.push('Duration must be greater than 0.');
    props.startTime > 0 ? true : validation.push('Start time must be greater than 0.');
    props.date ? true : validation.push('Appoinment date must be provided.');
    this.isAppoinmentStatusValid(props.status) ? true : validation.push(`Status is not valid: ${props.status}.`);
    if (validation.length) {
      return Result.fail<Appointment>(validation.join(' '));
    }
    return Result.ok(true);
  }

  private setAppointmentDate(date: Date) {
    if (!(date instanceof Date)) {
      const error = Result.fail<string>('Date must be instance of Date.');
      return error;
    }
    this.props.date = date;
    return Result.ok<string>('Appointment date changed successfully');
  }

  private setAppointmentDuration(duration: Minutes): Result<string> {
    if (duration < 0) {
      const error = Result.fail<string>('Duration must be greater than 0.');
      return error;
    }
    this.props.duration = duration;
    return Result.ok<string>('Duration changed successfully');
  }

  private setAppointmentStartTime(startTime: Minutes): Result<string> {
    if (startTime < 0) {
      const error = Result.fail<string>('Start time must be greater than 0.');
      return error;
    }
    this.props.startTime = startTime;
    return Result.ok<string>('Appointment staring time changed successfully.');
  }

  private setAppointmentClientId(clientId?: ClientId | null | undefined): Result<string> {
    this.props.clientId = clientId;
    return Result.ok<string>('Client id has been changed.');
  }

  public setAppointmentStatus(status: AppointmentStatus): Result<string> {
    if (!Appointment.isAppoinmentStatusValid(status)) {
      const error = Result.fail<string>('Invalid appointment status.');
      return error;
    }
    this.props.status = status;
    return Result.ok<string>('Appoinment status changed successfully.');
  }

  public addTreatment(treatment: Treatment): Result<string> {
    this.props.treatments.list.push(treatment);
    return Result.ok<string>('Treatment added.');
  }

  public removeTreatment(treatment: Treatment): Result<string> {
    if (this.props.treatments.list.length === 0) return Result.fail<string>('No treatments.');
    const res = this.props.treatments.list.filter((t) => t.treatmentId.value !== treatment.treatmentId.value);
    this.props.treatments = Treatments.create(res);
    return Result.ok<string>('Treatment has been removed.');
  }

  public updateDetails(data: Omit<AppointmentProps, 'accountId'>): Result<Appointment | string> {
    const validationResult = Appointment.validator(data);

    if (validationResult.isFailure) {
      return Result.fail<Appointment>(validationResult.error);
    }

    const resultDuration = this.setAppointmentDuration(data.duration);
    const resultStartDate = this.setAppointmentStartTime(data.startTime);
    const resultDate = this.setAppointmentDate(data.date);
    const resultClientId = this.setAppointmentClientId(data.clientId);
    const resultStatus = this.setAppointmentStatus(data.status);
    this.props.treatments = data.treatments;

    const bulkValidation = Result.bulkCheck([resultDuration, resultStartDate, resultDate, resultClientId, resultStatus]);

    if (bulkValidation.isFailure) {
      return Result.fail(bulkValidation.error);
    }

    return Result.ok<string>('Appointment updated successfully.');
  }

  public static create(props: AppointmentProps, id?: UniqueEntityID): Result<Appointment> {
    const validationResult = this.validator(props);

    if (validationResult.isFailure) {
      return Result.fail<Appointment>(validationResult.error);
    }

    const isSomeTreatmentNotBelongsToAccount = props.treatments.list.some((id) => id.accountId.id.getValue() !== props.accountId.id.getValue());

    if (isSomeTreatmentNotBelongsToAccount) {
      return Result.fail<Appointment>('Treatment not found.');
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
