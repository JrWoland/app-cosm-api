import { UnprocessableEntityException } from '@nestjs/common';
import { ValueObject } from 'src/shared/ValueObject';

export class ClientSurname extends ValueObject<string> {
  private static minLength = 1;

  private static maxLength = 85;

  private constructor(private surname: string) {
    super(surname);
  }

  public get value() {
    return this.surname;
  }

  public static create(surname: string): ClientSurname {
    if (surname === null || surname === undefined || surname === '') {
      throw new UnprocessableEntityException('ClientSurname name cannot be empty.');
    }
    if (surname.length < this.minLength || surname.length > this.maxLength) {
      throw new UnprocessableEntityException(
        `ClientSurname name must have ${this.minLength} to ${this.maxLength} characters. Currently provided ${surname.length} characters.`,
      );
    }
    return new ClientSurname(surname);
  }
}
