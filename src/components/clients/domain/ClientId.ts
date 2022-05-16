import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Entity } from '../../../core/domain/Entity';
import { Result } from '../../../core/logic/Result';

export class ClientId extends Entity<null> {
  get clientId(): UniqueEntityID {
    return this._uniqueEntityId;
  }

  get value(): string {
    return this._uniqueEntityId.getValue();
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: UniqueEntityID): Result<ClientId> {
    return Result.ok<ClientId>(new ClientId(id));
  }
}
