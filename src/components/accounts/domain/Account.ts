import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { AccountPassword } from './AccountPassword';

interface AccountProps {
  email: string;
  password: AccountPassword;
}

export class Account extends AggregateRoot {
  private constructor(private props: AccountProps) {
    super();
    this.props = props;
  }

  get account_id(): UniqueEntityID {
    return this._uniqueEntityId;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): AccountPassword {
    return this.props.password;
  }

  public static create(account: AccountProps) {
    return new Account(account);
  }
}
