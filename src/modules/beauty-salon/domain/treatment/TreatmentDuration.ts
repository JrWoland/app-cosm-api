import { UnprocessableEntityException } from '@nestjs/common';
import { ValueObject } from 'src/shared/ValueObject';

type DurationInMinutes = number;

export class TreatmentDuration extends ValueObject<DurationInMinutes> {
  private constructor(private duration: DurationInMinutes) {
    super(duration);
  }

  public get value() {
    return this.duration;
  }

  public static create(duration: DurationInMinutes): TreatmentDuration {
    if (duration === null || duration <= 0) {
      throw new UnprocessableEntityException(`Duration must be greater than 0. Provided duration: ${duration}`);
    }

    return new TreatmentDuration(duration);
  }
}
