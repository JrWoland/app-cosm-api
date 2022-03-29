import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Result } from '../../../core/logic/Result';
import { AccountId } from './AccountId';
import { AccountPassword } from './AccountPassword';

interface AccountProps {
  email: string;
  password: AccountPassword;
}

export class Account extends AggregateRoot<AccountProps> {
  private constructor(props: AccountProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get accountId(): AccountId {
    return AccountId.create(this._uniqueEntityId).getValue();
  }

  get email(): string {
    return this.props.email;
  }

  get password(): AccountPassword {
    return this.props.password;
  }

  public static create(account: AccountProps, id?: UniqueEntityID): Result<Account> {
    const isNewUser = id ? false : true;
    if (isNewUser) {
      // event
    }
    return Result.ok<Account>(new Account(account, id));
  }
}
