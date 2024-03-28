import { UnprocessableEntityException } from '@nestjs/common';
import { ValueObject } from 'src/shared/ValueObject';

export class TreatmentName extends ValueObject<string> {
  private static minLength = 1;

  private static maxLength = 85;

  private constructor(private name: string) {
    super(name);
  }

  public get value() {
    return this.name;
  }

  public static create(name: string): TreatmentName {
    if (name === null || name === undefined || name === '') {
      throw new UnprocessableEntityException('Treatment name cannot be empty.');
    }
    if (name.length < this.minLength || name.length > this.maxLength) {
      throw new UnprocessableEntityException(
        `Treatment name must have ${this.minLength} to ${this.maxLength} characters. Currently provided ${name.length} characters.`,
      );
    }
    return new TreatmentName(name);
  }
}