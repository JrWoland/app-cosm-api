import { UnprocessableEntityException } from '@nestjs/common';
import dayjs from 'dayjs';
import { ValueObject } from 'src/shared/ValueObject';

type CardDateProps = string;

export class CardDate extends ValueObject<CardDateProps> {
  private constructor(private date: CardDateProps) {
    super(date);
  }

  public get value(): Date {
    const date = new Date(this.date);
    return date;
  }

  public static create(date: CardDateProps): CardDate {
    const isInvalidDate = date === null || date === '' || !dayjs(new Date(date)).isValid();

    if (isInvalidDate) {
      throw new UnprocessableEntityException(`Card date is not valid: ${date}. Valid format YYYY-MM-DD.`);
    }

    return new CardDate(date);
  }
}
