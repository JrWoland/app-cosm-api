import dayjs from 'dayjs';
import { UnprocessableEntityException } from '@nestjs/common';
import { ValueObject } from 'src/shared/ValueObject';

type ClientBirthDayProps = string | null;

const BIRTHDAY_ERROR_MESSAGE = 'Birth day format is not valid';

export class ClientBirthDay extends ValueObject<ClientBirthDayProps> {
  private constructor(private birth: ClientBirthDayProps) {
    super(birth);
  }

  public get value(): Date | null {
    const date = this.birth ? new Date(this.birth) : null;
    return date;
  }

  public static create(birth: ClientBirthDayProps): ClientBirthDay {
    if (birth === null || birth === '') return new ClientBirthDay(null);

    if (!dayjs(new Date(birth)).isValid()) {
      throw new UnprocessableEntityException(`${BIRTHDAY_ERROR_MESSAGE}: ${birth}. Valid format YYYY-MM-DD.`);
    }
    return new ClientBirthDay(birth);
  }
}
