import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { AccountPassword } from './AccountPassword';

interface AccountProps {
  email: string;
  password: AccountPassword;
}

export class Account extends AggregateRoot {
  private constructor(private props: AccountProps, id?: UniqueEntityID) {
    super(id);
    this.props = props;
  }

  get accountId(): UniqueEntityID {
    return this._uniqueEntityId;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): AccountPassword {
    return this.props.password;
  }

  public static create(account: AccountProps, id?: UniqueEntityID) {
    return new Account(account, id);
  }
}
