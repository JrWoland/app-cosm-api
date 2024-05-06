import { UniqueEntityID } from 'src/shared/UniqueId';
import { ValueObject } from 'src/shared/ValueObject';

export class AppointmentId extends ValueObject<{ value: UniqueEntityID }> {
  get value(): string {
    return this.id.getValue();
  }

  private constructor(
    private id: UniqueEntityID,
    private __name__ = 'AppointmentId',
  ) {
    super({ value: id });
  }

  public static create(id: UniqueEntityID): AppointmentId {
    return new AppointmentId(id);
  }
}
