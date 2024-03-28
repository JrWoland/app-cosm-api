import { UnprocessableEntityException } from '@nestjs/common';
import dayjs from 'dayjs';
import { ValueObject } from 'src/shared/ValueObject';

type AppointmentDateProps = string;

export class AppointmentDate extends ValueObject<AppointmentDateProps> {
  private constructor(private date: AppointmentDateProps) {
    super(date);
  }

  public get value(): Date {
    const date = new Date(this.date);
    return date;
  }

  public static create(date: AppointmentDateProps): AppointmentDate {
    const isInvalidDate = date === null || date === '' || !dayjs(new Date(date)).isValid();

    if (isInvalidDate) {
      throw new UnprocessableEntityException(`Appointment date is not valid: ${date}. Valid format YYYY-MM-DD.`);
    }

    return new AppointmentDate(date);
  }
}
