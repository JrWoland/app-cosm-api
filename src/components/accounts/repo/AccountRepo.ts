import { Model } from 'mongoose';
import { AccountDocModel } from '../../../infra/db/models/accountModel';
import { Account } from '../domain/Account';
import { AccountId } from '../domain/AccountId';
import { AccountMap } from './mappers/AccountMap';

export interface IAccountRepo {
  findAccountByAccountEmail(email: string): Promise<Account>;
  findAccountByAccountId(id: AccountId): Promise<Account>;
  exists(email: string): Promise<boolean>;
  save(account: Account): Promise<void>;
}

export class AccountRepo implements IAccountRepo {
  constructor(private model: Model<AccountDocModel>) {}

  public async findAccountByAccountEmail(email: string): Promise<Account> {
    try {
      const account = await this.model.find({ email: email }).exec();
      if (account.length === 0) {
        throw new Error('Account does not exists.');
      }
      return new AccountMap().toDomain(account[0]);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async findAccountByAccountId(accountId: AccountId): Promise<Account> {
    try {
      const account = await this.model.find({ _id: accountId.id.getValue() }).exec();
      if (account.length === 0) {
        throw new Error('Account does not exists.');
      }
      return new AccountMap().toDomain(account[0]);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async exists(email: string): Promise<boolean> {
    try {
      const accountExists = await this.model.exists({ email: email });
      return accountExists;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async save(account: Account): Promise<void> {
    try {
      const accountToSave = new AccountMap().toPersistence(account);
      const exists = await this.exists(account.email);
      if (!exists) {
        const newAccount = new this.model(accountToSave);
        await newAccount.save();
      } else {
        await this.model.findOneAndUpdate(
          {
            email: account.email,
          },
          accountToSave,
        );
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
