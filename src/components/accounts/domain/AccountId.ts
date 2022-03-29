import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Entity } from '../../../core/domain/Entity';
import { Result } from '../../../core/logic/Result';

export class AccountId extends Entity<null> {
  get accountId(): UniqueEntityID {
    return this._uniqueEntityId;
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: UniqueEntityID): Result<AccountId> {
    return Result.ok<AccountId>(new AccountId(id));
  }
}
