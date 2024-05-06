import { UniqueEntityID } from 'src/shared/UniqueId';
import { ValueObject } from 'src/shared/ValueObject';

export class ClientId extends ValueObject<{ value: UniqueEntityID }> {
  get value(): string {
    return this.id.getValue();
  }

  private constructor(
    private id: UniqueEntityID,
    private __name__ = 'ClientId',
  ) {
    super({ value: id });
  }

  public static create(id: UniqueEntityID): ClientId {
    return new ClientId(id);
  }
}
