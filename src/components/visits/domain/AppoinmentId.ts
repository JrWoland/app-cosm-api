import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Entity } from '../../../core/domain/Entity';
import { Result } from '../../../core/logic/Result';

export class AppointmentId extends Entity<null> {
  get appoinmentId(): UniqueEntityID {
    return this._uniqueEntityId;
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: UniqueEntityID): Result<AppointmentId> {
    return Result.ok<AppointmentId>(new AppointmentId(id));
  }
}
