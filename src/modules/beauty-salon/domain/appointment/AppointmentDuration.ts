import { ValueObject } from 'src/shared/ValueObject';
import { UnprocessableEntityException } from '@nestjs/common';
type DurationInMinutes = number;

export class AppointmentDuration extends ValueObject<DurationInMinutes> {
  private constructor(private duration: DurationInMinutes) {
    super(duration);
  }

  public get value() {
    return this.duration;
  }

  public static create(duration: DurationInMinutes): AppointmentDuration {
    if (duration === null || duration <= 0) {
      throw new UnprocessableEntityException(`Duration must be greater than 0. Provided duration: ${duration}`);
    }

    return new AppointmentDuration(duration);
  }
}
