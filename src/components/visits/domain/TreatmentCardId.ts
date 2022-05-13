import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Entity } from '../../../core/domain/Entity';
import { Result } from '../../../core/logic/Result';

export class TreatmentCardId extends Entity<null> {
  get value(): string {
    return this._uniqueEntityId.getValue();
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: UniqueEntityID): Result<TreatmentCardId> {
    return Result.ok<TreatmentCardId>(new TreatmentCardId(id));
  }
}
