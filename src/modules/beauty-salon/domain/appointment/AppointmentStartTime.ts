import { UnprocessableEntityException } from '@nestjs/common';
import { ValueObject } from 'src/shared/ValueObject';

type StartTimeInMinutes = number;

export class AppointmentStartTime extends ValueObject<StartTimeInMinutes> {
  private constructor(private startTime: StartTimeInMinutes) {
    super(startTime);
  }

  public get value() {
    return this.startTime;
  }

  public static create(time: StartTimeInMinutes): AppointmentStartTime {
    if (time === null || time <= 0) {
      throw new UnprocessableEntityException(`Start time must be greater than 0. Provided start time: ${time}.`);
    }
    return new AppointmentStartTime(time);
  }
}
