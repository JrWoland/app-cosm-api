import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Result } from '../../../core/logic/Result';
import APP_CONFIG from '../../../localSettings';
import { Account } from '../domain/Account';
import { IAccountRepo } from '../repo/AccountRepo';

export interface IAuthService {
  basicAccountAuth(accountEmail: string, password: string): Promise<Result<Account>>;
  generateJwtToken(account: Omit<Account, 'password' | 'id' | 'email'>): string;
}

export class AuthService implements IAuthService {
  constructor(private accountRepo: IAccountRepo) {}

  public generateJwtToken(account: Omit<Account, 'password' | 'id' | 'email' | 'props'>): string {
    const jwtPayload = { accountId: account.accountId.id.getValue() };
    const token = jwt.sign(jwtPayload, APP_CONFIG.JWT_KEY, { expiresIn: APP_CONFIG.JWT_EXPIRES_IN });
    return token;
  }

  public async basicAccountAuth(accountEmail: string, password: string): Promise<Result<Account>> {
    try {
      const account = await this.accountRepo.findAccountByAccountEmail(accountEmail);
      const thePasswordsAreTheSame = bcrypt.compareSync(password, account.password.value);
      if (!thePasswordsAreTheSame) {
        return Result.fail<Account>('Auth failed');
      } else {
        return Result.ok<Account>(account);
      }
    } catch (error) {
      return Result.fail<Account>('Auth failed');
    }
  }
}
