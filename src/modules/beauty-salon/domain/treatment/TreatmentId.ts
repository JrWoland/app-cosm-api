import { Entity } from 'src/shared/Entity';
import { UniqueEntityID } from 'src/shared/UniqueId';

export class TreatmentId extends Entity {
  get value(): string {
    return this._uniqueEntityId.getValue();
  }

  private constructor(id?: UniqueEntityID) {
    super(id);
  }

  public static create(id?: UniqueEntityID): TreatmentId {
    return new TreatmentId(id);
  }
}
