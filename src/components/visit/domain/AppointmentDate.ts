import dayjs from 'dayjs';
import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';

type AppointmentDateProps = string;

export class AppointmentDate extends ValueObject<AppointmentDateProps> {
  private constructor(private date: AppointmentDateProps) {
    super(date);
  }

  public get value(): Date {
    const date = new Date(this.date);
    return date;
  }

  public static create(date: AppointmentDateProps): Result<AppointmentDate> {
    if (date === null || date === '' || !dayjs(date).isValid()) {
      return Result.fail<AppointmentDate>(`Appointment date is not valid: ${date}`);
    }

    return Result.ok<AppointmentDate>(new AppointmentDate(date));
  }
}
