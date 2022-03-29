import { AccountModel } from '../../../infra/db/models/accountModel';
import { AccountRepo } from './AccountRepo';

const AccountRepository = new AccountRepo(AccountModel);

export { AccountRepository };
