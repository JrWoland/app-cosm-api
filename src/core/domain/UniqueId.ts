import { v4 } from 'uuid';

export class UniqueEntityID {
  private id: string;
  constructor(id?: string | null) {
    this.id = id || v4();
  }

  public getValue() {
    if (!this.id) {
      throw new Error(`Cant retrieve the value from when Id id null or undefined`);
    }

    return this.id;
  }
}
