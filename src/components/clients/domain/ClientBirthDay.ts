import dayjs from 'dayjs';
import { ValueObject } from '../../../core/domain/ValueObject';
import { Result } from '../../../core/logic/Result';

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

  public static create(birth: ClientBirthDayProps): Result<ClientBirthDay> {
    if (birth === null || birth === '') return Result.ok<ClientBirthDay>(new ClientBirthDay(null));

    if (!dayjs(new Date(birth)).isValid()) {
      return Result.fail<ClientBirthDay>(`${BIRTHDAY_ERROR_MESSAGE}: ${birth}. Valid format YYYY-MM-DD.`);
    }
    return Result.ok<ClientBirthDay>(new ClientBirthDay(birth));
  }
}
