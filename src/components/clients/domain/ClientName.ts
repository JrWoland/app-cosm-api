import { ValueObject } from '../../../core/domain/ValueObject';
import { Result } from '../../../core/logic/Result';

type ClientNameProps = string;

const NAME_ERROR_MESSAGE = 'Client need to have name but received:';

export class ClientName extends ValueObject<ClientNameProps> {
  private constructor(private name: ClientNameProps) {
    super(name);
  }

  get value(): ClientNameProps {
    return this.name;
  }

  private static isValid(value: string | null): boolean {
    if (value === null || value.length === 0) {
      return false;
    }

    return true;
  }

  public static create(name: ClientNameProps): Result<ClientName> {
    if (!ClientName.isValid(name)) {
      return Result.fail<ClientName>(`${NAME_ERROR_MESSAGE} ${name}`);
    }
    return Result.ok<ClientName>(new ClientName(name.trim()));
  }
}
