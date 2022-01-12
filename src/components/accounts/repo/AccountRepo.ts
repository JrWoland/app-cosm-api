import { AccountModel } from '../../../infra/db/models/accountModel';
import { Account } from '../domain/Account';
import { AccountMap } from './mappers/AccountMap';

export interface IAccountRepo {
  findAccountByEmail(email: string): Promise<Account>;
  exists(email: string): Promise<boolean>;
  save(account: Account): Promise<void>;
}

export class AccountRepo implements IAccountRepo {
  private model;
  constructor() {
    this.model = AccountModel;
  }

  public async findAccountByEmail(email: string): Promise<Account> {
    try {
      const account = await this.model.find({ email: email }).exec();
      return new AccountMap().toDomain(account);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async exists(email: string): Promise<boolean> {
    try {
      const account = await this.model.find({ email: email }).exec();
      if (account.length >= 1) {
        return true;
      } else {
        return false;
      }
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
