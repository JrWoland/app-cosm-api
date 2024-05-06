import { UniqueEntityID } from 'src/shared/UniqueId';
import { ValueObject } from 'src/shared/ValueObject';

export class AccountId extends ValueObject<{ value: UniqueEntityID }> {
  get value(): string {
    return this.id.getValue();
  }

  private constructor(
    private id: UniqueEntityID,
    private __name__ = 'AccountId',
  ) {
    super({ value: id });
  }

  public static create(accountID: UniqueEntityID): AccountId {
    return new AccountId(accountID);
  }
}
