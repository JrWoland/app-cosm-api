import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import { UnprocessableEntityException } from '@nestjs/common';
import { ValueObject } from 'src/shared/ValueObject';

type ClientBirthDayProps = string | null;

const BIRTHDAY_ERROR_MESSAGE = 'Birth day format is not valid';
const VALID_FORMAT = 'YYYY-MM-DD';

export class ClientBirthDay extends ValueObject<ClientBirthDayProps> {
  private constructor(private birth: ClientBirthDayProps) {
    super(birth);
  }

  public get value(): Date | null {
    const date = this.birth ? new Date(this.birth) : null;
    return date;
  }

  public static create(birth: ClientBirthDayProps): ClientBirthDay {
    console.log(typeof birth);
    if (birth === null || birth === '') return new ClientBirthDay(null);

    if (!dayjs(new Date(birth)).isValid()) {
      throw new UnprocessableEntityException(`${BIRTHDAY_ERROR_MESSAGE}: ${birth}.`);
    }

    const formatted = dayjs(birth).format(VALID_FORMAT);

    return new ClientBirthDay(formatted);
  }
}
