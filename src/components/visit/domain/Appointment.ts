import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Result } from '../../../core/logic/Result';
import { AccountId } from '../../accounts/domain/AccountId';
import { ClientId } from '../../clients/domain/ClientId';
import { AppointmentDate } from './AppointmentDate';
import { AppointmentDuration } from './AppointmentDuration';
import { AppointmentId } from './AppointmentId';
import { AppointmentStartTime } from './AppointmentStartTime';
import { AppointmentStatus } from './AppointmentStatus';
import { Treatment } from './Treatment';
import { Treatments } from './Treatments';

interface AppointmentProps {
  accountId: AccountId;
  clientId: ClientId;
  duration: AppointmentDuration;
  date: AppointmentDate;
  startTime: AppointmentStartTime;
  status: AppointmentStatus;
  treatments: Treatments;
}
interface IAppointmentProps {
  accountId: string;
  clientId: string;
  duration: number;
  date: string;
  startTime: number;
  status: string;
  treatments: Treatments;
}

export class Appointment extends AggregateRoot<AppointmentProps> {
  private constructor(readonly props: AppointmentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public get appointmentId(): AppointmentId {
    return AppointmentId.create(this._uniqueEntityId).getValue();
  }

  public get accountId(): AccountId {
    return this.props.accountId;
  }

  public get clientId(): ClientId {
    return this.props.clientId;
  }

  public get date(): Date {
    return this.props.date.value;
  }

  public get startTime(): AppointmentStartTime {
    return this.props.startTime;
  }

  public get duration(): AppointmentDuration {
    return this.props.duration;
  }

  public get status(): AppointmentStatus {
    return this.props.status;
  }

  public get treatments(): Treatments {
    return this.props.treatments;
  }

  public setAppointmentStatus(status: string): Result<string> {
    if (!AppointmentStatus.isStatusValid(status)) {
      const error = Result.fail<string>('Invalid appointment status.');
      return error;
    }

    const newStatus = AppointmentStatus.create(status);

    if (newStatus.isFailure) {
      return Result.fail<string>('Invalid appointment status.');
    }

    this.props.status = newStatus.getValue();
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

  public updateDetails(appointment: Omit<IAppointmentProps, 'accountId' | 'status'>): Result<Appointment | string> {
    const clientId = ClientId.create(new UniqueEntityID(appointment.clientId));
    const appointmentDuration = AppointmentDuration.create(appointment.duration);
    const appointmentDate = AppointmentDate.create(appointment.date);
    const appointmentStartTime = AppointmentStartTime.create(appointment.startTime);
    this.props.treatments = appointment.treatments;

    const bulkValidation = Result.bulkCheck([clientId, appointmentDuration, appointmentDate, appointmentStartTime]);

    if (bulkValidation.isFailure) {
      return Result.fail(bulkValidation.error);
    }

    if (appointment.clientId !== undefined) {
      this.props.clientId = clientId.getValue();
    }

    if (appointment.date !== undefined) {
      this.props.date = appointmentDate.getValue();
    }

    if (appointment.duration !== undefined) {
      this.props.duration = appointmentDuration.getValue();
    }

    if (appointment.startTime !== undefined) {
      this.props.startTime = appointmentStartTime.getValue();
    }

    return Result.ok<string>('Appointment updated successfully.');
  }

  public static create(props: IAppointmentProps, id?: UniqueEntityID): Result<Appointment> {
    const accountId = AccountId.create(new UniqueEntityID(props.accountId));
    const clientId = ClientId.create(new UniqueEntityID(props.clientId));
    const appointmentDuration = AppointmentDuration.create(props.duration);
    const appointmentDate = AppointmentDate.create(props.date);
    const appointmentStartTime = AppointmentStartTime.create(props.startTime);
    const appointmentStatus = AppointmentStatus.create(props.status);

    const isSomeTreatmentNotBelongsToAccount = props.treatments.list.some((id) => id.accountId.id.getValue() !== props.accountId);

    const bulkValidation = Result.bulkCheck([accountId, clientId, appointmentDuration, appointmentDate, appointmentStartTime]);

    if (bulkValidation.isFailure) {
      return Result.fail(bulkValidation.error);
    }

    if (isSomeTreatmentNotBelongsToAccount) {
      return Result.fail<Appointment>('Treatment not found.');
    }

    const appointment = new Appointment(
      {
        accountId: accountId.getValue(),
        clientId: clientId.getValue(),
        date: appointmentDate.getValue(),
        duration: appointmentDuration.getValue(),
        startTime: appointmentStartTime.getValue(),
        status: appointmentStatus.getValue(),
        treatments: props.treatments,
      },
      id,
    );

    return Result.ok<Appointment>(appointment);
  }
}
