import { ValueObject } from '../../../core/domain/ValueObject';
import { Result } from '../../../core/logic/Result';
import { mailRegex } from '../../../core/utils/mailRegex';

type ClientEmailProps = string | null;

const EMAIL_ERROR_MESSAGE = 'Email structure is invalid';

export class ClientEmail extends ValueObject<ClientEmailProps> {
  private constructor(private email: ClientEmailProps) {
    super(email);
  }

  get value(): ClientEmailProps {
    return this.email;
  }

  private static isValid(value: string | null): boolean {
    if (value === null || value === '') return true;
    if (!value?.match(mailRegex)) {
      return false;
    }

    return true;
  }

  public static create(email: ClientEmailProps): Result<ClientEmail> {
    if (!ClientEmail.isValid(email)) {
      return Result.fail<ClientEmail>(`${EMAIL_ERROR_MESSAGE}: ${email}`);
    }
    return Result.ok<ClientEmail>(new ClientEmail(email));
  }
}
