import { UniqueEntityID } from 'src/shared/UniqueId';
import { ValueObject } from 'src/shared/ValueObject';

export class TreatmentId extends ValueObject<{ value: UniqueEntityID }> {
  get value(): string {
    return this.id.getValue();
  }

  private constructor(
    private id: UniqueEntityID,
    private __name__ = 'TreatmentId',
  ) {
    super({ value: id });
  }

  public static create(id: UniqueEntityID): TreatmentId {
    return new TreatmentId(id);
  }
}
