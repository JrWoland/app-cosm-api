import { Entity } from 'src/shared/Entity';
import { UniqueEntityID } from 'src/shared/UniqueId';

export class ClientId extends Entity {
  get value(): string {
    return this._uniqueEntityId.getValue();
  }

  private constructor(
    id?: UniqueEntityID,
    private __name__ = 'ClientId',
  ) {
    super(id);
  }

  public static create(id?: UniqueEntityID): ClientId {
    return new ClientId(id);
  }
}
