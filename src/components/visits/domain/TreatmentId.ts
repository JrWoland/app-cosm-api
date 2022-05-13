import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Entity } from '../../../core/domain/Entity';
import { Result } from '../../../core/logic/Result';

export class TreatmentId extends Entity<null> {
  get value(): string {
    return this._uniqueEntityId.getValue();
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: UniqueEntityID): Result<TreatmentId> {
    return Result.ok<TreatmentId>(new TreatmentId(id));
  }
}
