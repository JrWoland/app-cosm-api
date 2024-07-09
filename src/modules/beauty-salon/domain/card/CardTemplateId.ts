import { UniqueEntityID } from 'src/shared/UniqueId';
import { ValueObject } from 'src/shared/ValueObject';

export class CardTemplateId extends ValueObject<{ value: UniqueEntityID }> {
  get value(): string {
    return this.id.getValue();
  }

  private constructor(
    private id: UniqueEntityID,
    private __name__ = 'CardTemplateId',
  ) {
    super({ value: id });
  }

  public static create(id: UniqueEntityID): CardTemplateId {
    return new CardTemplateId(id);
  }
}
