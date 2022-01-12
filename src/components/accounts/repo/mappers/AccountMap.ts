import { AccountDocModel } from '../../../../infra/db/models/accountModel';
import { Account } from '../../domain/Account';
import { AccountPassword } from '../../domain/AccountPassword';

interface IAccountMap<T> {
  toPersistence(t: T): any;
  toDomain(raw: any): T;
}

export class AccountMap implements IAccountMap<Account> {
  toPersistence(account: Account): AccountDocModel {
    return {
      account_id: account.account_id.getValue(),
      email: account.email,
      password: account.password.value,
    };
  }

  toDomain(raw: any): Account {
    const password = AccountPassword.create({ value: raw });

    const account = Account.create({
      email: '',
      password: password.getValue(),
    });

    return account;
  }
}
