import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Result } from '../../../core/logic/Result';
import { AccountId } from '../../accounts/domain/AccountId';
import { ClientId } from '../../clients/domain/ClientId';
import { AppointmentId } from './AppointmentId';
import { AppointmentStatus } from './AppointmentStatus';
import { Treatment } from './Treatment';

interface AppointmentProps {
  accountId: AccountId;
  clientId?: ClientId | null;
  date: Date;
  startTime: number;
  duration: number;
  status: AppointmentStatus;
  treatments: Treatment[];
}

export class Appointment extends AggregateRoot<AppointmentProps> {
  private constructor(props: AppointmentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get appointmentId(): AppointmentId {
    return AppointmentId.create(this._uniqueEntityId).getValue();
  }

  private static isAppoinmentStatusValid(status: AppointmentStatus): boolean {
    return [AppointmentStatus.ClientNotAppeard, AppointmentStatus.Declined, AppointmentStatus.Finished, AppointmentStatus.New].includes(status);
  }

  private static validator(props: AppointmentProps): Result<any> {
    const validation: string[] = [];
    const isDurationPositive = props.duration > 0 ? true : validation.push('Duration must be grater than 0.');
    const isStartTimePositive = props.startTime > 0 ? true : validation.push('Start time must be grater than 0.');
    const isDateValid = props.date ? true : validation.push('Appoinment date must be provided.');
    const isStatusValid = this.isAppoinmentStatusValid(props.status) ? true : validation.push(`Status is not valid: ${props.status}.`);
    if (validation.length) {
      return Result.fail<Appointment>(validation.join(' '));
    }
    return Result.ok(true);
  }

  public addTreatment(treatment: Treatment): Result<string> {
    this.props.treatments.push(treatment);
    return Result.ok<string>('Treatment added.');
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
