import { UnprocessableEntityException } from '@nestjs/common';
import { ValueObject } from 'src/shared/ValueObject';

type ClientPhoneNumberProps = string | null;

const Phone_ERROR_MESSAGE = 'Phone structure is invalid';

export class ClientPhoneNumber extends ValueObject<ClientPhoneNumberProps> {
  private constructor(private phone: ClientPhoneNumberProps) {
    super(phone);
  }

  public get value(): ClientPhoneNumberProps {
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

  public static create(phone: ClientPhoneNumberProps): ClientPhoneNumber {
    const trimmed = phone?.trim() || null;
    if (!ClientPhoneNumber.isValid(trimmed)) {
      throw new UnprocessableEntityException(`${Phone_ERROR_MESSAGE}: ${phone}`);
    }
    return new ClientPhoneNumber(trimmed);
  }
}
