import { ValueObject } from '../../../core/domain/ValueObject';
import { Result } from '../../../core/logic/Result';

type ClientPhoneNumberProps = string | null;

const Phone_ERROR_MESSAGE = 'Phone structure is invalid';

export class ClientPhoneNumber extends ValueObject<ClientPhoneNumberProps> {
  private constructor(private phone: ClientPhoneNumberProps) {
    super(phone);
  }

  get value(): ClientPhoneNumberProps {
    return this.phone;
  }

  private static isValid(value: string | null): boolean {
    if (value === null || value === '') return true;
    if (!value?.startsWith('+')) {
      return false;
    }
    const re = /^\d+$/;
    const hasOnlyDigits = re.test(value.slice(1));

    if (!hasOnlyDigits) {
      return false;
    }

    return true;
  }

  public static create(phone: ClientPhoneNumberProps): Result<ClientPhoneNumber> {
    const trimmed = phone?.trim() || null;
    if (!ClientPhoneNumber.isValid(trimmed)) {
      return Result.fail<ClientPhoneNumber>(`${Phone_ERROR_MESSAGE}: ${phone}`);
    }
    return Result.ok<ClientPhoneNumber>(new ClientPhoneNumber(trimmed));
  }
}
