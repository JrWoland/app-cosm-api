import { UnprocessableEntityException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export class UniqueEntityID {
  private value: string;

  constructor(id?: string | null) {
    this.value = id || randomUUID().toString();
  }

  public getValue() {
    if (!this.value) {
      throw new UnprocessableEntityException(`Cannot retrieve the value from when id null or undefined`);
    }

    return this.value;
  }
}
