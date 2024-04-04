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
    const trimmed = value?.trim() || null;
    if (!trimmed?.startsWith('+')) {
      return false;
    }

    const re = /^\d+$/;
    const hasOnlyDigits = re.test(trimmed.slice(1));

    if (!hasOnlyDigits) {
      return false;
    }

    return true;
  }

  public static create(phone: ClientPhoneNumberProps): ClientPhoneNumber {
    if (!ClientPhoneNumber.isValid(phone)) {
      throw new UnprocessableEntityException(`${Phone_ERROR_MESSAGE}: ${phone}. Valid format should start with +XX.`);
    }
    return new ClientPhoneNumber(phone);
  }
}
