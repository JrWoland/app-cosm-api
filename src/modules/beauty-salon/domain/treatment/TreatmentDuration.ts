import { UnprocessableEntityException } from '@nestjs/common';
import { ValueObject } from 'src/shared/ValueObject';

type DurationInMinutes = number;

const MAX_DURATION_MINUTES_LENGTH = 1440; // 24h
export class TreatmentDuration extends ValueObject<DurationInMinutes> {
  private constructor(private duration: DurationInMinutes) {
    super(duration);
  }

  public get value() {
    return this.duration;
  }

  public static create(duration: DurationInMinutes): TreatmentDuration {
    if (duration === null || duration <= 0 || duration > MAX_DURATION_MINUTES_LENGTH) {
      throw new UnprocessableEntityException(`Duration must be greater than 0h and less than 24h. Provided duration: ${duration}`);
    }

    return new TreatmentDuration(duration);
  }
}
