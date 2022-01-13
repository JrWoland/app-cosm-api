import { AccountDocModel } from '../../../../infra/db/models/accountModel';
import { Mapper } from '../../../../core/infra/Mapper';
import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { Account } from '../../domain/Account';
import { AccountPassword } from '../../domain/AccountPassword';

export class AccountMap implements Mapper<Account> {
  toPersistence(account: Account): AccountDocModel {
    return {
      account_id: account.accountId.getValue(),
      email: account.email,
      password: account.password.value,
    };
  }

  toDomain(raw: AccountDocModel): Account {
    const password = AccountPassword.create({ value: raw.password, hashed: true });

    const account = Account.create(
      {
        email: raw.email,
        password: password.getValue(),
      },
      new UniqueEntityID(raw.account_id),
    );

    return account;
  }
}
