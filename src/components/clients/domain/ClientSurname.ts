import { ValueObject } from '../../../core/domain/ValueObject';
import { Result } from '../../../core/logic/Result';

type ClientSurnameProps = string | null;

export class ClientSurname extends ValueObject<ClientSurnameProps> {
  private constructor(private surname: ClientSurnameProps) {
    super(surname);
  }

  get value(): ClientSurnameProps {
    return this.surname;
  }

  public static create(surname: ClientSurnameProps): Result<ClientSurname> {
    return Result.ok<ClientSurname>(new ClientSurname(surname));
  }
}
