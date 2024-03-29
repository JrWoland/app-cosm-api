import { UnprocessableEntityException } from '@nestjs/common';
import { ValueObject } from 'src/shared/ValueObject';
import { mailRegex } from 'src/shared/regex/mailRegex';

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

  public static create(email: ClientEmailProps): ClientEmail {
    if (!ClientEmail.isValid(email)) {
      throw new UnprocessableEntityException(`${EMAIL_ERROR_MESSAGE}: ${email}`);
    }
    return new ClientEmail(email);
  }
}
