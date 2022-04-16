import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { LoginAccountDTO, LoggedAccountDTO } from './LoginAccountDTO';
import { IAccountRepo } from '../../repo/AccountRepo';
import { AccountPassword } from '../../domain/AccountPassword';
import { Account } from '../../domain/Account';
import APP_CONFIG from '../../../../localSettings';
import jwt from 'jsonwebtoken';
import { IAuthService } from '../../services/AuthService';

type Response = Result<LoggedAccountDTO>;
export class LoginAccountUseCase implements UseCase<LoginAccountDTO, Promise<Response>> {
  constructor(private accountRepo: IAccountRepo, private authService: IAuthService) {}

  private generateJwtToken(account: Omit<Account, 'password' | 'id' | 'email'>): string {
    const jwtPayload = { accountId: account.accountId };
    const token = jwt.sign(jwtPayload, APP_CONFIG.JWT_KEY, { expiresIn: APP_CONFIG.JWT_EXPIRES_IN });
    return token;
  }

  public async execute(request: LoginAccountDTO): Promise<Response> {
    const { email, password } = request;

    try {
      const account = await this.accountRepo.findAccountByAccountEmail(email);

      const isPasswordValid = AccountPassword.comparePassword(account.password.value, password);

      if (isPasswordValid) {
        const jwtToken = this.authService.generateJwtToken(account);
        return Result.ok<LoggedAccountDTO>({ token: jwtToken });
      } else {
        return Result.fail('Password or email is invalid.');
      }
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
