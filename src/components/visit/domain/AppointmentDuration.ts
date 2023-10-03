import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';

type DurationInMinutes = number;

export class AppointmentDuration extends ValueObject<DurationInMinutes> {
  private constructor(private duration: DurationInMinutes) {
    super(duration);
  }

  public get value() {
    return this.duration;
  }

  public static create(duration: DurationInMinutes): Result<AppointmentDuration> {
    if (duration === null || duration <= 0) {
      return Result.fail<AppointmentDuration>(`Duration must be greater than 0. Provided duration: ${duration}`);
    }

    return Result.ok<AppointmentDuration>(new AppointmentDuration(duration));
  }
}
