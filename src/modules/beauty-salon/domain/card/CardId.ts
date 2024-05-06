import { UniqueEntityID } from 'src/shared/UniqueId';
import { ValueObject } from 'src/shared/ValueObject';

export class CardId extends ValueObject<{ value: UniqueEntityID }> {
  get value(): UniqueEntityID {
    return this.id;
  }

  private constructor(
    private id: UniqueEntityID,
    private __name__ = 'CardTemplateId',
  ) {
    super({ value: id });
  }

  public static create(id: UniqueEntityID): CardId {
    return new CardId(id);
  }
}
