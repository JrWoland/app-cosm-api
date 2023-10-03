import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';

type StartTimeInMinutes = number;

export class AppointmentStartTime extends ValueObject<StartTimeInMinutes> {
  private constructor(private duration: StartTimeInMinutes) {
    super(duration);
  }

  public get value() {
    return this.duration;
  }

  public static create(time: StartTimeInMinutes): Result<AppointmentStartTime> {
    if (time === null || time <= 0) {
      return Result.fail<AppointmentStartTime>('Start time must be greater than 0. Provided start time: 0.');
    }
    return Result.ok<AppointmentStartTime>(new AppointmentStartTime(time));
  }
}
